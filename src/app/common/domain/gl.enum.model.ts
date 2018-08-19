export let GlSubType=[
    {label:"Select subtype",value:null},
    {label:"General",value:"GENERAL"},
    {label:"Inter branch",value:"INTER_BRANCH"},
    {label:"Adjustable debit", value:"ADJUSTABLE_DEBIT"},
    {label:"Adjustable credit", value:"ADJUSTABLE_CREDIT"}
]

export let GlType=[
    {label:"Select type",value:null},
    {label:"Product GL",value:"PRODUCT_GL"},
    {label:"Internal",value:"INTERNAL"}
]

export let LeafType=[
    {label:"Select leaf type",value:null},
    {label:"Node",value:"NODE"},
    {label:"Parent",value:"PARENT"}
]

export let ReconciliationType=[
    {label:"Select reconciliation type",value:null},
    {label:"Direct",value:"Direct"},
    {label:"Split",value:"Split"}
]

export let ReEvaluationFrequency=[
    {label:"Select re-evaluation frequency",value:null},
    {label:"Daily",value:"DAILY"},
    {label:"Monthly",value:"MONTHLY"},
    {label:"Yearly",value:"YEARLY"},
]

export let Status=[
    {label:"Select status",value:null},
    {label:"Active",value:"ACTIVATED"},
    {label:"Lock",value:"LOCKED"},
    {label:"Close",value:"CLOSED"}
]

// export let GLCurrencyRestriction=[
//     {label:"Select Currency Restriction",value:null},
//     {label:"Single Currency", value:"SINGLE_CURRENCY"},
//     {label:"All Foreign Currency",value:"ALL_FOREIGN_CURRENCY"},
//     {label:"All Currency",value:"ALL_CURRENCY"},
//     {label:"Local Currency",value:"LOCAL_CURRENCY"},
//      {label:"Specific Currencies",value:"SPECIFIC_CURRENCIES"}
// ]

export let GLCurrencyRestriction = [
    {label:"Select currency type",value:null},
    {label:"Local currency",value:"LOCAL_CURRENCY"},
    {label:"Specific currencies",value:"MULTIPLE_CURRENCY"}
]

export let GlBranchRestrictions = [
    {label: "Select transaction scope", value: null },
    {label: "Head office", value: "HEAD_OFFICE" },
    {label: "Specific branch", value: "SPECIFIC_BRANCH" },
    {label: "All branches", value: "ALL_BRANCH" }
   
]

export let AccountNature = [ 
    {label: "Select account nature", value: null },
    {label: "Asset", value: "ASSET" },
    {label: "Liability", value: "LIABILITY" },
    {label: "Income", value: "INCOME" },
    {label: "Expenditure", value: "EXPENDITURE" }

]
