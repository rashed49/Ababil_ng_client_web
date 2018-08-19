export const deploymentBranchMenus = [
    { label: 'Dashboard', icon: 'dashboard', routerLink: ['/'] },
    { label: 'Gl Account', icon: 'dashboard', routerLink: ['/glaccount'] },
    { label: 'Balance Sheet Mapping', icon: 'dashboard', routerLink: ['/glaccount/balance-sheet-configuration'] },
    {
        label: 'Approval Flow', icon: 'dashboard',
        items: [
            { label: 'Approval Flow Setup', icon: 'dashboard', routerLink: ['/approval-flow'] },
            { label: 'Command Mapping', icon: 'dashboard', routerLink: ['/approval-flow/command/mappings'] },
            { label: 'Pending Task', icon: 'list', routerLink: ['/approval-flow/pendingtasks'] }
        ]
    },
    { label: 'Report', icon: 'dashboard', routerLink: ['/report'] }
];

export const developmentBranchMenus = [
    { label: 'Dashboard', icon: 'dashboard', routerLink: ['/'] },
    {
        label: 'Portfolio', icon: 'dashboard',
        items: [
            {
                label: 'Demand Deposit', icon: 'dashboard',
                items: [
                    { label: 'Product', icon: 'dashboard', routerLink: ['/demand-deposit-product'] },
                    { label: 'Charge Configuration', icon: 'dashboard', routerLink: ['/demand-deposit-charge'] }
                ]
            },
            {
                label: 'Time Deposit', icon: 'dashboard',
                items: [
                    {
                        label: 'Product', icon: 'dashboard',
                        items: [
                            { label: 'Fixed Deposit', icon: 'dashboard', routerLink: ['/fixed-deposit-product'] },
                            { label: 'Installment Deposit', icon: 'dashboard', routerLink: ['/recurring-deposit-product'] }
                        ]
                    },
                    { label: 'Charge Configuration', icon: 'dashboard', routerLink: ['/time-deposit-charge'] }

                ]
            },
            { label: 'Investment', icon: 'dashboard', routerLink: [''] }
        ]
    },
    { label: 'Gl Account', icon: 'dashboard', routerLink: ['/glaccount'] },
    { label: 'Balance Sheet Mapping', icon: 'dashboard', routerLink: ['/glaccount/balance-sheet-configuration'] },
    {
        label: 'Approval Flow', icon: 'dashboard',
        items: [
            { label: 'Approval Flow Setup', icon: 'dashboard', routerLink: ['/approval-flow'] },
            { label: 'Command Mapping', icon: 'dashboard', routerLink: ['/approval-flow/command/mappings'] },
            { label: 'Pending Task', icon: 'list', routerLink: ['/approval-flow/pendingtasks'] }
        ]
    },
    {
        label: 'CIS', icon: 'dashboard',
        items: [
            { label: 'Active Customers', icon: 'list', routerLink: ['/customer/activecustomer'] },
            { label: 'Inactive Customers', icon: 'list', routerLink: ['/customer/inactivecustomer'] },
            { label: 'Owner Type', icon: 'list', routerLink: ['/customer/organizationtypemappingwithownertype'] },
            { label: 'Lien', icon: 'list', routerLink: ['/lien'] }

        ]
    },
    {
        label: 'Cash', icon: 'dashboard',
        items: [
            { label: 'Teller Setup', icon: 'list', routerLink: ['/teller-setup'] },
            { label: 'Teller Allocation', icon: 'list', routerLink: ['/teller-allocation'] },
            { label: 'Teller Transaction', icon: 'list', routerLink: ['/teller-transaction'] },
            { label: 'Service provider', icon: 'list', routerLink: ['/service-provider'] }
        ]
    },
    { label: 'Banks', icon: 'dashboard', routerLink: ['/banks'] },
    { label: 'Identity', icon: 'dashboard', routerLink: ['/identity'] },

    {
        label: 'Inland Remittance', icon: 'dashboard',
        items: [
            { label: 'Charge Configuration', icon: 'list', routerLink: ['/remittance/charge'] },
            { label: 'Lot', icon: 'list', routerLink: ['/remittance/lot-list'] },
            { label: 'Instrument', icon: 'list', routerLink: ['/remittance/instrument-list'] },
            { label: 'Issue', icon: 'list', routerLink: ['/remittance/issue-list'] }
        ]
    },
    {
        label: 'Income tax configuration', icon:'dashboard', routerLink: ['/income-tax-configuration-view']

    }
];
