import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppProvider, useApp } from './context/AppContext';
import { NativeDeviceFrame } from './components/native/NativeDeviceFrame';
import { NativeHeader } from './components/native/NativeHeader';
import { NativeTabBar, TabId } from './components/native/NativeTabBar';
import { DashboardScreen } from './screens/DashboardScreen';
import { ContractsScreen } from './screens/ContractsScreen';
import { WorkProgressScreen } from './screens/WorkProgressScreen';
import { PaymentsScreen } from './screens/PaymentsScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { ContractDetailModal } from './components/native/ContractDetailModal';
import { NativeContractWizard } from './components/native/NativeContractWizard';
import { RemediesModal } from './components/native/RemediesModal';
import { NotificationsModal } from './components/native/NotificationsModal';
import { Contract } from './types';

const MainAppContent: React.FC = () => {
  const { setActiveContractId } = useApp();
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [createWizardOpen, setCreateWizardOpen] = useState(false);
  const [remediesModalOpen, setRemediesModalOpen] = useState(false);

  const handleOpenContract = (contract: Contract) => {
    setSelectedContract(contract);
    setActiveContractId(contract.id);
  };

  const handleWizardSuccess = (newId: string) => {
    setCreateWizardOpen(false);
    setActiveContractId(newId);
    setCurrentTab('contracts');
  };

  return (
    <NativeDeviceFrame>
      <NativeHeader />

      <View style={styles.mainScreenContainer}>
        {currentTab === 'dashboard' && (
          <DashboardScreen
            onNavigateToTab={(t) => setCurrentTab(t)}
            onOpenContract={handleOpenContract}
            onOpenCreateWizard={() => setCreateWizardOpen(true)}
            onOpenRemediesCalculator={() => setRemediesModalOpen(true)}
          />
        )}

        {currentTab === 'contracts' && (
          <ContractsScreen
            onOpenContract={handleOpenContract}
            onOpenCreateWizard={() => setCreateWizardOpen(true)}
          />
        )}

        {currentTab === 'tracker' && (
          <WorkProgressScreen
            onOpenRemediesCalculator={() => setRemediesModalOpen(true)}
          />
        )}

        {currentTab === 'payments' && (
          <PaymentsScreen />
        )}

        {currentTab === 'assistant' && (
          <AIAssistantScreen
            onOpenContract={handleOpenContract}
          />
        )}
      </View>

      {/* Contract Detail Modal */}
      <ContractDetailModal
        contract={selectedContract}
        visible={selectedContract !== null}
        onClose={() => setSelectedContract(null)}
        onNavigateToTab={(t) => {
          setSelectedContract(null);
          setCurrentTab(t);
        }}
        onOpenRemediesCalculator={() => setRemediesModalOpen(true)}
      />

      {/* New Agreement Creation Wizard Modal */}
      <NativeContractWizard
        visible={createWizardOpen}
        onClose={() => setCreateWizardOpen(false)}
        onSuccess={handleWizardSuccess}
      />

      {/* Fair Delay Remedies Calculator Modal */}
      <RemediesModal
        visible={remediesModalOpen}
        onClose={() => setRemediesModalOpen(false)}
      />

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        onOpenContract={handleOpenContract}
      />

      {/* Native Bottom Tab Bar */}
      <NativeTabBar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />
    </NativeDeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});
