import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  Contract,
  Notification,
  initialContracts,
  initialNotifications,
  TODAY,
} from './data';

export type Tab = 'home' | 'contracts' | 'notifications' | 'profile';

export type Route =
  | { name: 'tabs' }
  | { name: 'contractDetails'; id: string }
  | { name: 'fullContract'; id: string }
  | { name: 'workProgress'; id: string }
  | { name: 'assistant' }
  | { name: 'createContract' };

export interface User {
  name: string;
  email: string;
  phone: string;
}

interface Store {
  // auth
  authStage: 'onboarding' | 'signIn' | 'signUp' | 'app';
  setAuthStage: (s: Store['authStage']) => void;
  user: User;
  signIn: (email: string) => void;
  signUp: (u: User) => void;
  signOut: () => void;
  // nav
  tab: Tab;
  setTab: (t: Tab) => void;
  stack: Route[];
  push: (r: Route) => void;
  pop: () => boolean;
  // data
  contracts: Contract[];
  getContract: (id: string) => Contract | undefined;
  addContract: (c: Omit<Contract, 'id'>) => string;
  completeStage: (contractId: string, stageId: string) => void;
  acceptDeliverable: (contractId: string) => void;
  raiseDispute: (contractId: string, reason: string) => void;
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  // feedback
  toast: { message: string; tone: ToastTone } | null;
  showToast: (message: string, tone?: ToastTone) => void;
}

export type ToastTone = 'success' | 'danger' | 'info';

const Ctx = createContext<Store | null>(null);

const nameFromEmail = (email: string) => {
  const raw = email.split('@')[0].split(/[._-]/)[0] || 'there';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authStage, setAuthStage] = useState<Store['authStage']>('onboarding');
  const [user, setUser] = useState<User>({ name: 'Rocky', email: 'rocky@izere.rw', phone: '+250 788 123 456' });
  const [tab, setTab] = useState<Tab>('home');
  const [stack, setStack] = useState<Route[]>([{ name: 'tabs' }]);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const [toast, setToast] = useState<Store['toast']>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, tone });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const push = useCallback((r: Route) => setStack((s) => [...s, r]), []);
  const pop = () => {
    if (stack.length <= 1) return false;
    setStack((s) => s.slice(0, -1));
    return true;
  };

  const signIn = (email: string) => {
    setUser((u) => ({ ...u, email, name: nameFromEmail(email) }));
    setTab('home');
    setStack([{ name: 'tabs' }]);
    setAuthStage('app');
  };
  const signUp = (u: User) => {
    setUser(u);
    setTab('home');
    setStack([{ name: 'tabs' }]);
    setAuthStage('app');
  };
  const signOut = () => setAuthStage('signIn');

  const getContract = useCallback((id: string) => contracts.find((c) => c.id === id), [contracts]);

  const addActivity = (c: Contract, text: string): Contract => ({
    ...c,
    activity: [{ text, date: TODAY.toISOString() }, ...c.activity],
  });

  const addContract: Store['addContract'] = (c) => {
    const id = `CTR-${String(contracts.length + 1).padStart(3, '0')}`;
    setContracts((cs) => [{ ...c, id }, ...cs]);
    setNotifications((ns) => [
      {
        id: 'n' + Date.now(),
        kind: 'milestone',
        category: 'update',
        title: 'Contract created',
        body: `${c.title} was sent to ${c.client} for confirmation.`,
        time: 'Just now',
        read: false,
        contractId: id,
      },
      ...ns,
    ]);
    showToast('Contract sent for confirmation');
    return id;
  };

  const completeStage: Store['completeStage'] = (contractId, stageId) => {
    setContracts((cs) =>
      cs.map((c) => {
        if (c.id !== contractId) return c;
        const idx = c.stages.findIndex((s) => s.id === stageId);
        const stages = c.stages.map((s, i) => {
          if (i === idx) return { ...s, status: 'completed' as const };
          if (i === idx + 1 && s.status === 'pending') return { ...s, status: 'in_progress' as const };
          return s;
        });
        const allDone = stages.every((s) => s.status === 'completed');
        const next = addActivity({ ...c, stages }, `Milestone completed: ${c.stages[idx].name}`);
        return allDone ? { ...next, status: 'awaiting_acceptance' } : { ...next, status: c.status === 'pending' ? 'active' : c.status };
      }),
    );
    const c = contracts.find((x) => x.id === contractId);
    const st = c?.stages.find((s) => s.id === stageId);
    if (c && st) {
      setNotifications((ns) => [
        {
          id: 'n' + Date.now(),
          kind: 'milestone',
          category: 'update',
          title: 'Milestone completed',
          body: st.name,
          time: 'Just now',
          read: false,
          contractId,
        },
        ...ns,
      ]);
      showToast(`${st.name} marked complete`);
    }
  };

  const acceptDeliverable = (contractId: string) => {
    showToast('Deliverable accepted — contract completed');
    setContracts((cs) =>
      cs.map((c) =>
        c.id === contractId
          ? addActivity(
              { ...c, status: 'completed', stages: c.stages.map((s) => ({ ...s, status: 'completed' })) },
              'Deliverable accepted — contract completed',
            )
          : c,
      ),
    );
  };

  const raiseDispute = (contractId: string, reason: string) => {
    showToast('Dispute raised — delay penalties paused', 'danger');
    setContracts((cs) =>
      cs.map((c) =>
        c.id === contractId ? addActivity({ ...c, status: 'disputed' }, `Dispute raised: ${reason}`) : c,
      ),
    );
  };

  const markRead = (id: string) =>
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const value = useMemo<Store>(
    () => ({
      authStage,
      setAuthStage,
      user,
      signIn,
      signUp,
      signOut,
      tab,
      setTab,
      stack,
      push,
      pop,
      contracts,
      getContract,
      addContract,
      completeStage,
      acceptDeliverable,
      raiseDispute,
      notifications,
      markRead,
      markAllRead,
      toast,
      showToast,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authStage, user, tab, stack, contracts, notifications, toast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
};
