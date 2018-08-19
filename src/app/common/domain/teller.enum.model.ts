export let CurrencyRestriction=[
    {label:"Choose",value:null},
    {label:"Local Currency",value:"LOCAL_CURRENCY"},
    {label:"Multiple Currency",value:"MULTIPLE_CURRENCY"}
]

export let TellerType=[
    {label:"Choose",value:null},
    {label:"Vault", value:"VAULT"},
    {label:"Mini Vault",value:"MINI_VAULT"},
    {label:"Teller",value:"TELLER"}
]

export let TransactionParticulars = [
    { label: 'Choose', value: null },
    { label: 'Cash Remittance', value: '001' },
    { label: 'DD Issued', value: '002' },
    { label: 'M.T. Issued', value: '003' },
    { label: 'T.T. Issued', value: '004' },
    { label: 'Bills', value: '005' },
    { label: 'OBC', value: '006' },
    { label: 'Clearing', value: '007' },
    { label: 'Cost of F.C. and L.C', value: '008' },
    { label: 'Transport bills', value: '009' },
    { label: 'F.B.P.', value: '010' },
    { label: 'F.C.D.P.', value: '011' },
    { label: 'Cheques rtd. in clg.', value: '012' },
    { label: 'Remittance', value: '013' },
    { label: 'Sundries', value: '014' },

];


export let AccountTypes = [
    // { label: 'Select account type', value: null },
    { label: 'ACCOUNT', value: 'ACCOUNT' },
    { label: 'GL', value: 'GL' },
    { label: 'SUBGL', value: 'SUBGL' }
];



export let SubAccountTypes = [
    { label: 'Select sub account type', value: null },
    { label: 'CASA', value: 'CASA' },
    { label: 'SSP', value: 'SSP' },
    { label: 'MTDR', value: 'MTDR' }
];


export let TransactionTypes =[
    { label: 'OWN BRANCH', value: 'own' },
    { label: 'INTER BRANCH', value: 'inter' }
]


export let TransferTypes = [
    { label: 'Cash receive', value: 'receive' },
    { label: 'Cash send', value: 'send' },
];

