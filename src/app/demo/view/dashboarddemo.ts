import { Component, OnInit } from '@angular/core';
import { EventService } from '../service/eventservice';
import { GeneralLedgerIncomeExpense } from '../../services/glaccount/domain/gl.account.income.expense.model';
import { GlAccountDashboardService } from '../../services/glaccount/service-api/gl.account.dashboard.service';
import { BaseComponent } from '../../common/components/base.component';
import { TopBranches } from '../../services/glaccount/domain/top.branches.model';
@Component({
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class DashboardDemoComponent extends BaseComponent implements OnInit {
    bardata: any;
    doughnutdata: any;
    monthWiseIncomeExpenseList: GeneralLedgerIncomeExpense[] = [];
    incomeData: number[] = [];
    expenseData: number[] = [];
    currentMonth: number;
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    sixMonths: string[] = [];
    extractedMonths: number[] = [];
    finalMonths: string[] = [];
    topIncomeBranches: TopBranches[];
    topInvestmentBranches: TopBranches[];
    topDepositBranches: TopBranches[];
    totalIncome = 0;
    totalInvestment = 0;
    totalDeposit = 0;
    totalExpense = 0;
    freeCostDeposit = 0;
    highCostDeposit = 0;
    lowCostDeposit = 0;
    totalDepositWithoutPrecision: number;
    totalInvestmentWithoutPrecision: number;
    totalIncomeWithoutPrecision: number;
    constructor(private glDashboardService: GlAccountDashboardService) {
        super();
    }
    ngOnInit() {
        this.fetchTotalIncome();
        this.fetchTotalInvestment();
        this.fetchTotalDeposit();
        this.fetchTotalExpense();
        this.setBarChartData();
        this.setDoughnutChartData();
        this.fetchIncomeExpense();
        this.fetchDepositDetail();
        this.fetchTopIncomeBranches();
        this.fetchTopInvestmentBranches();
        this.fetchTopDepositBranches();
    }
    setBarChartData() {
        this.bardata = {
            labels: this.finalMonths,
            datasets: [
                {
                    label: 'Income',
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    data: this.incomeData,
                },
                {
                    label: 'Expense',
                    backgroundColor: '#9CCC65',
                    borderColor: '#7CB342',
                    data: this.expenseData,
                }
            ]
        };
    }
    setDoughnutChartData() {
        this.doughnutdata = {
            labels: ['Free cost Deposit', 'High Cost Deposit', 'Low Cost Deposit'],
            datasets: [
                {
                    data: [this.freeCostDeposit, this.highCostDeposit, this.lowCostDeposit],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ]
                }]
        };
    }
    fetchIncomeExpense() {

        this.subscribers.fetchIncomeExpenseSub = this.glDashboardService
            .fetchGlAccountIncomeExpense()
            .subscribe(data => {
                this.monthWiseIncomeExpenseList = data;
                this.incomeData = this.monthWiseIncomeExpenseList.map(incomedata => +(incomedata.income / 10000000));
                this.expenseData = this.monthWiseIncomeExpenseList.map(expensedata => +(expensedata.expense / 10000000));
                this.extractedMonths = this.monthWiseIncomeExpenseList.map(extractedMonths => extractedMonths.month);
                this.finalMonths = this.extractedMonths.map(month => this.months[month - 1]);
                this.setBarChartData();
            });
    }
    fetchTopIncomeBranches() {
        this.subscribers.fetchTopIncomeBranchesSubs = this.glDashboardService
            .fetchTopIncomeBranches()
            .subscribe(data => {
                this.topIncomeBranches = data;
                if (this.topIncomeBranches.length > 0) {
                    for (let i = 0; i < this.topIncomeBranches.length; i++) {
                        this.topIncomeBranches[i].percentageOfTotalAmount =
                            +((this.topIncomeBranches[i].amount / this.totalIncomeWithoutPrecision) * 100).toFixed(2);
                    }
                }
            });
    }
    fetchTopInvestmentBranches() {
        this.subscribers.fetchTopInvestmentBranchesSubs = this.glDashboardService
            .fetchTopInvestmentBranches()
            .subscribe(data => {
                this.topInvestmentBranches = data;
                if (this.topInvestmentBranches.length > 0) {
                    for (let i = 0; i < this.topInvestmentBranches.length; i++) {
                        this.topInvestmentBranches[i].percentageOfTotalAmount =
                            +((this.topInvestmentBranches[i].amount / this.totalInvestmentWithoutPrecision) * 100).toFixed(2);
                    }
                }
            });
    }
    fetchTopDepositBranches() {
        this.subscribers.fetchTopDepositBranchesSubs = this.glDashboardService
            .fetchTopDepositBranches()
            .subscribe(data => {
                this.topDepositBranches = data;
                if (this.topDepositBranches.length > 0) {
                    for (let i = 0; i < this.topDepositBranches.length; i++) {
                        this.topDepositBranches[i].percentageOfTotalAmount =
                            +((this.topDepositBranches[i].amount / this.totalDepositWithoutPrecision) * 100).toFixed(2);
                    }
                }

            });

    }
    fetchTotalIncome() {
        this.subscribers.fetchTotalIncomeSubs = this.glDashboardService
            .fetchTotalIncome()
            .subscribe(data => {
                this.totalIncomeWithoutPrecision = data;
                this.totalIncome = data / 10000000;
                this.totalIncome = +this.totalIncome.toPrecision(2);
            });
    }
    fetchTotalInvestment() {
        this.subscribers.fetchTotalInvestmentSubs = this.glDashboardService
            .fetchTotalInvestment()
            .subscribe(data => {
                this.totalInvestmentWithoutPrecision = data;
                this.totalInvestment = data / 10000000;
                this.totalInvestment = +this.totalInvestment.toPrecision(2);
            });
    }
    fetchTotalDeposit() {
        this.subscribers.fetchTotalDepositSubs = this.glDashboardService
            .fetchTotalDeposit()
            .subscribe(data => {
                this.totalDepositWithoutPrecision = data;
                this.totalDeposit = data / 10000000;
                this.totalDeposit = +this.totalDeposit.toPrecision(2);
            });
    }
    fetchTotalExpense() {
        this.subscribers.fetchTotalExpenseSubs = this.glDashboardService
            .fetchTotalExpense()
            .subscribe(data => {
                this.totalExpense = data / 10000000;
                this.totalExpense = +this.totalExpense.toPrecision(2);
            });
    }
    fetchDepositDetail() {
        this.subscribers.fetchDepositDetailSubs = this.glDashboardService
            .fetchDepositDetail()
            .subscribe(data => {
                this.highCostDeposit = data.highCostDeposit;
                this.lowCostDeposit = data.lowCostDeposit;
                this.freeCostDeposit = data.freeCostDeposit;
                this.setDoughnutChartData();
            }
            );
    }

    // cities: SelectItem[];

    // cars: Car[];

    // chartData: any;

    // events: any[];

    // selectedCity: any;

    // constructor(private carService: CarService, private eventService: EventService) { }

    // ngOnInit() {
    //     this.carService.getCarsSmall().then(cars => this.cars = cars);

    //     this.eventService.getEvents().then(events => {
    //         this.events = events;
    //         console.log(this.events);
    //     });


    //     this.cities = [];
    //     this.cities.push({label:'Select City', value:null});
    //     this.cities.push({label:'New York', value:{id:1, name: 'New York', code: 'NY'}});
    //     this.cities.push({label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}});
    //     this.cities.push({label:'London', value:{id:3, name: 'London', code: 'LDN'}});
    //     this.cities.push({label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}});
    //     this.cities.push({label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}});

    //     this.chartData = {
    //         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //         datasets: [
    //             {
    //                 label: 'First Dataset',
    //                 data: [65, 59, 80, 81, 56, 55, 40],
    //                 fill: false,
    //                 borderColor: '#FFC107'
    //             },
    //             {
    //                 label: 'Second Dataset',
    //                 data: [28, 48, 40, 19, 86, 27, 90],
    //                 fill: false,
    //                 borderColor: '#03A9F4'
    //             }
    //         ]
    //     }
    // }
}
