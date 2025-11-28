import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { FormData, AssetInfo, LiabilityInfo } from '../../types';
import StepHeader from '../StepHeader';
import { SelectionButton } from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { Lightbulb, Building, TrendingUp, Gift, Zap, CreditCard, Car, GraduationCap, FileText, Users } from '../icons';

interface Step2cProps {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const assetOptions = [
    { key: 'bankAccount', label: 'Bank account', icon: <Building className="h-6 w-6" />, accountType: 'Checking Account' },
    { key: 'savings', label: 'Savings', icon: <Building className="h-6 w-6" />, accountType: 'Savings Account' },
    { key: 'retirement', label: 'Retirement', icon: <TrendingUp className="h-6 w-6" />, accountType: 'Retirement Account' },
    { key: 'stocks', label: 'Stocks/Bonds', icon: <TrendingUp className="h-6 w-6" />, accountType: 'Stocks/Bonds' },
    { key: 'other', label: 'Other', icon: <Zap className="h-6 w-6" />, accountType: 'Other' },
];

const liabilityOptions = [
    { key: 'creditCards', label: 'Credit cards', icon: <CreditCard className="h-6 w-6" />, type: 'Credit Card' },
    { key: 'carLoan', label: 'Car loan', icon: <Car className="h-6 w-6" />, type: 'Automobile' },
    { key: 'studentLoans', label: 'Student loans', icon: <GraduationCap className="h-6 w-6" />, type: 'Student Loan' },
    { key: 'personalLoans', label: 'Personal loans', icon: <FileText className="h-6 w-6" />, type: 'Personal Loan' },
    { key: 'childSupport', label: 'Child support / alimony', icon: <Users className="h-6 w-6" />, type: 'Other' },
];

const Step2cAssetsLiabilities: React.FC<Step2cProps> = ({ data, onDataChange, onNext, onBack }) => {
    // Initialize selected assets from existing data
    const initializeSelectedAssets = () => {
        const selected = new Set<string>();
        // Check legacyAssets first
        if (data.legacyAssets && data.legacyAssets.length > 0) {
            data.legacyAssets.forEach((asset, index) => {
                const option = assetOptions.find(o => o.accountType === asset.accountType);
                if (option) {
                    selected.add(option.key);
                }
            });
        }
        // Also check Prep4Loan format
        if (data.assets) {
            Object.keys(data.assets).forEach(key => {
                if (key !== 'skip' && data.assets && data.assets[key as keyof typeof data.assets] !== undefined) {
                    selected.add(key);
                }
            });
        }
        return selected;
    };

    // Initialize selected liabilities from existing data
    const initializeSelectedLiabilities = () => {
        const selected = new Set<string>();
        // Check otherLiabilities first
        if (data.otherLiabilities && data.otherLiabilities.length > 0) {
            data.otherLiabilities.forEach((liab, index) => {
                const option = liabilityOptions.find(o => o.type === liab.type);
                if (option) {
                    selected.add(option.key);
                }
            });
        }
        // Also check Prep4Loan format
        if (data.debts) {
            Object.keys(data.debts).forEach(key => {
                if (key !== 'none' && data.debts && data.debts[key as keyof typeof data.debts] !== undefined) {
                    selected.add(key);
                }
            });
        }
        return selected;
    };

    const [selectedAssets, setSelectedAssets] = useState<Set<string>>(initializeSelectedAssets);
    const [selectedLiabilities, setSelectedLiabilities] = useState<Set<string>>(initializeSelectedLiabilities);

    // Initialize legacyAssets and otherLiabilities from Prep4Loan data
    useEffect(() => {
        const assets: AssetInfo[] = [];
        const liabilities: LiabilityInfo[] = [];

        // Map assets from Prep4Loan format
        if (data.assets) {
            if (data.assets.bankAccount) {
                assets.push({
                    accountType: 'Checking Account',
                    cashOrMarketValue: data.assets.bankAccount,
                    accountNumber: '',
                    financialInstitution: ''
                });
            }
            if (data.assets.savings) {
                assets.push({
                    accountType: 'Savings Account',
                    cashOrMarketValue: data.assets.savings,
                    accountNumber: '',
                    financialInstitution: ''
                });
            }
            if (data.assets.retirement) {
                assets.push({
                    accountType: 'Retirement Account',
                    cashOrMarketValue: data.assets.retirement,
                    accountNumber: '',
                    financialInstitution: ''
                });
            }
        }

        // Map debts from Prep4Loan format
        if (data.debts) {
            if (data.debts.carLoan) {
                liabilities.push({
                    type: 'Automobile',
                    monthlyPayment: Math.round(data.debts.carLoan / 60), // Estimate
                    unpaidBalance: data.debts.carLoan,
                    creditorName: ''
                });
            }
            if (data.debts.creditCards) {
                liabilities.push({
                    type: 'Credit Card',
                    monthlyPayment: Math.round(data.debts.creditCards * 0.02), // Estimate 2% min payment
                    unpaidBalance: data.debts.creditCards,
                    creditorName: ''
                });
            }
            if (data.debts.studentLoans) {
                liabilities.push({
                    type: 'Student Loan',
                    monthlyPayment: Math.round(data.debts.studentLoans / 120), // Estimate
                    unpaidBalance: data.debts.studentLoans,
                    creditorName: ''
                });
            }
        }

        if (assets.length > 0 || liabilities.length > 0) {
            onDataChange({
                legacyAssets: assets.length > 0 ? assets : undefined,
                otherLiabilities: liabilities.length > 0 ? liabilities : undefined
            });
        }
    }, []); // Only run once on mount

    const handleAssetToggle = (key: string) => {
        const option = assetOptions.find(o => o.key === key);
        if (!option) return;

        const newSelected = new Set(selectedAssets);
        const existingAssets = data.legacyAssets || [];
        const assetKeys = Array.from(selectedAssets);
        
        if (newSelected.has(key)) {
            // Remove asset
            newSelected.delete(key);
            const assetIndex = assetKeys.indexOf(key);
            const updated = existingAssets.filter((_, index) => index !== assetIndex);
            setSelectedAssets(newSelected);
            onDataChange({ legacyAssets: updated.length > 0 ? updated : undefined });
        } else {
            // Add asset
            newSelected.add(key);
            const newAsset: AssetInfo = {
                accountType: option.accountType,
                cashOrMarketValue: (data.assets?.[key as keyof typeof data.assets] as number) || 0,
                accountNumber: '',
                financialInstitution: ''
            };
            setSelectedAssets(newSelected);
            onDataChange({ legacyAssets: [...existingAssets, newAsset] });
        }
    };

    const handleLiabilityToggle = (key: string) => {
        const option = liabilityOptions.find(o => o.key === key);
        if (!option) return;

        const newSelected = new Set(selectedLiabilities);
        const existingLiabilities = data.otherLiabilities || [];
        const liabilityKeys = Array.from(selectedLiabilities);
        
        if (newSelected.has(key)) {
            // Remove liability
            newSelected.delete(key);
            const liabilityIndex = liabilityKeys.indexOf(key);
            const updated = existingLiabilities.filter((_, index) => index !== liabilityIndex);
            setSelectedLiabilities(newSelected);
            onDataChange({ otherLiabilities: updated.length > 0 ? updated : undefined, debts: { ...data.debts, [key]: undefined, none: updated.length === 0 } });
        } else {
            // Add liability
            newSelected.add(key);
            const debtValue = (data.debts?.[key as keyof typeof data.debts] as number) || 0;
            const newLiability: LiabilityInfo = {
                type: option.type,
                monthlyPayment: key === 'creditCards' ? Math.round(debtValue * 0.02) : (key === 'carLoan' ? Math.round(debtValue / 60) : (key === 'studentLoans' ? Math.round(debtValue / 120) : 0)),
                unpaidBalance: debtValue,
                creditorName: ''
            };
            setSelectedLiabilities(newSelected);
            onDataChange({ 
                otherLiabilities: [...existingLiabilities, newLiability],
                debts: { ...data.debts, [key]: debtValue, none: false }
            });
        }
    };

    const handleAssetAmountChange = (key: string, value: number) => {
        const existingAssets = data.legacyAssets || [];
        const option = assetOptions.find(o => o.key === key);
        if (!option) return;

        const assetIndex = Array.from(selectedAssets).indexOf(key);
        if (assetIndex >= 0 && assetIndex < existingAssets.length) {
            const updated = [...existingAssets];
            updated[assetIndex] = { ...updated[assetIndex], cashOrMarketValue: value };
            onDataChange({ legacyAssets: updated });
        }
    };

    const handleLiabilityPaymentChange = (key: string, value: number) => {
        const existingLiabilities = data.otherLiabilities || [];
        const liabilityIndex = Array.from(selectedLiabilities).indexOf(key);
        if (liabilityIndex >= 0 && liabilityIndex < existingLiabilities.length) {
            const updated = [...existingLiabilities];
            updated[liabilityIndex] = { ...updated[liabilityIndex], monthlyPayment: value };
            onDataChange({ otherLiabilities: updated });
        }
    };

    const handleLiabilityBalanceChange = (key: string, value: number) => {
        const existingLiabilities = data.otherLiabilities || [];
        const liabilityIndex = Array.from(selectedLiabilities).indexOf(key);
        if (liabilityIndex >= 0 && liabilityIndex < existingLiabilities.length) {
            const updated = [...existingLiabilities];
            updated[liabilityIndex] = { ...updated[liabilityIndex], unpaidBalance: value };
            onDataChange({ otherLiabilities: updated });
        }
    };

    const getAssetValue = (key: string): number => {
        const existingAssets = data.legacyAssets || [];
        const assetIndex = Array.from(selectedAssets).indexOf(key);
        if (assetIndex >= 0 && assetIndex < existingAssets.length) {
            return existingAssets[assetIndex].cashOrMarketValue || 0;
        }
        return (data.assets?.[key as keyof typeof data.assets] as number) || 0;
    };

    const getLiabilityPayment = (key: string): number => {
        const existingLiabilities = data.otherLiabilities || [];
        const liabilityIndex = Array.from(selectedLiabilities).indexOf(key);
        if (liabilityIndex >= 0 && liabilityIndex < existingLiabilities.length) {
            return existingLiabilities[liabilityIndex].monthlyPayment || 0;
        }
        return 0;
    };

    const getLiabilityBalance = (key: string): number => {
        const existingLiabilities = data.otherLiabilities || [];
        const liabilityIndex = Array.from(selectedLiabilities).indexOf(key);
        if (liabilityIndex >= 0 && liabilityIndex < existingLiabilities.length) {
            return existingLiabilities[liabilityIndex].unpaidBalance || 0;
        }
        return (data.debts?.[key as keyof typeof data.debts] as number) || 0;
    };

    const totalAssets = (data.legacyAssets || []).reduce((sum, asset) => sum + (asset.cashOrMarketValue || 0), 0);
    const totalMonthlyLiabilities = (data.otherLiabilities || []).reduce((sum, liab) => sum + (liab.monthlyPayment || 0), 0);

    return (
        <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
            <StepHeader 
                title="Assets & Liabilities"
                subtitle="Information about your assets and outstanding debts"
            />
            
            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2.5 sm:p-3 text-blue-800 rounded-md flex items-start gap-2 sm:gap-2.5 mt-3 mb-4">
                <Lightbulb className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-semibold">Bella's Insight:</span> Assets help demonstrate your ability to cover down payment and closing costs. Liabilities are used to calculate your debt-to-income ratio. You don't need to list every small debt, but include all significant monthly obligations.
                </p>
            </div>

            <div className="space-y-4 mt-4">
                {/* Assets Section */}
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Assets</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {assetOptions.map((option) => (
                            <SelectionButton
                                key={option.key}
                                label={option.label}
                                icon={option.icon}
                                isSelected={selectedAssets.has(option.key)}
                                onClick={() => handleAssetToggle(option.key)}
                            />
                        ))}
                    </div>

                    {selectedAssets.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 mt-6"
                        >
                            {Array.from(selectedAssets).map((key) => {
                                const option = assetOptions.find(o => o.key === key);
                                if (!option) return null;
                                
                                return (
                                    <div key={key} className="bg-white border border-gray-200 p-4 rounded-lg">
                                        <label className="block text-sm font-medium text-black mb-2">
                                            {option.label} - Balance
                                        </label>
                                        <div className="space-y-3">
                                            <input
                                                type="range"
                                                min="0"
                                                max="2000000"
                                                step="1000"
                                                value={getAssetValue(key)}
                                                onChange={(e) => handleAssetAmountChange(key, Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">$0</span>
                                                <div className="text-center">
                                                    <p className="text-xl font-bold text-black">
                                                        ${getAssetValue(key).toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className="text-sm text-gray-500">$2M+</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {totalAssets > 0 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-semibold text-black">
                                Total Assets: <span className="text-green-600">${totalAssets.toLocaleString()}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Liabilities Section */}
                <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Liabilities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {liabilityOptions.map((option) => (
                            <SelectionButton
                                key={option.key}
                                label={option.label}
                                icon={option.icon}
                                isSelected={selectedLiabilities.has(option.key)}
                                onClick={() => handleLiabilityToggle(option.key)}
                            />
                        ))}
                        <SelectionButton
                            label="None"
                            isSelected={data.debts?.none === true && selectedLiabilities.size === 0}
                            onClick={() => {
                                setSelectedLiabilities(new Set());
                                onDataChange({ debts: { none: true }, otherLiabilities: undefined });
                            }}
                        />
                    </div>

                    {selectedLiabilities.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 mt-6"
                        >
                            {Array.from(selectedLiabilities).map((key) => {
                                const option = liabilityOptions.find(o => o.key === key);
                                if (!option) return null;
                                
                                return (
                                    <div key={key} className="bg-white border border-gray-200 p-4 rounded-lg space-y-4">
                                        <label className="block text-sm font-medium text-black mb-2">
                                            {option.label}
                                        </label>
                                        
                                        {/* Monthly Payment */}
                                        <div>
                                            <label className="block text-xs font-medium text-black mb-2">
                                                Monthly Payment
                                            </label>
                                            <div className="space-y-3">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="5000"
                                                    step="50"
                                                    value={getLiabilityPayment(key)}
                                                    onChange={(e) => handleLiabilityPaymentChange(key, Number(e.target.value))}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">$0</span>
                                                    <div className="text-center">
                                                        <p className="text-xl font-bold text-black">
                                                            ${getLiabilityPayment(key).toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500">per month</p>
                                                    </div>
                                                    <span className="text-sm text-gray-500">$5,000</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Unpaid Balance */}
                                        <div>
                                            <label className="block text-xs font-medium text-black mb-2">
                                                Unpaid Balance
                                            </label>
                                            <div className="space-y-3">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="200000"
                                                    step="1000"
                                                    value={getLiabilityBalance(key)}
                                                    onChange={(e) => handleLiabilityBalanceChange(key, Number(e.target.value))}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">$0</span>
                                                    <div className="text-center">
                                                        <p className="text-xl font-bold text-black">
                                                            ${getLiabilityBalance(key).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <span className="text-sm text-gray-500">$200K+</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {totalMonthlyLiabilities > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-semibold text-black">
                                Total Monthly Liabilities: <span className="text-red-600">${totalMonthlyLiabilities.toLocaleString()}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <StepNavigation onNext={onNext} onBack={onBack} />
        </div>
    );
};

export default Step2cAssetsLiabilities;

