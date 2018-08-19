import { Injectable } from '@angular/core';
import { HttpInterceptor } from '../../http.interceptor';
import { NotificationService } from '../../../common/notification/notification.service';
import { BaseService } from '../../base.service';
import * as endpoints from '../gl.account.endpoints';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlAccountDashboardService extends BaseService {

    constructor(private http: HttpInterceptor, private notificationService: NotificationService) {
        super();
    }

    public fetchGlAccountIncomeExpense(): Observable<any> {
        return this.http.get(endpoints.FETCH_GL_INCOME_EXPENSE_OF_LAST_12_MONTHS)
            .pipe(map(this.extractData));
    }

    public fetchTopIncomeBranches(): Observable<any> {
        return this.http.get(endpoints.FETCH_TOP_INCOME_BRANCHES)
            .pipe(map(this.extractData));
    }
    public fetchTopInvestmentBranches(): Observable<any> {
        return this.http.get(endpoints.FETCH_TOP_INVESTMENT_BRANCHES)
            .pipe(map(this.extractData));
    }

    public fetchTopDepositBranches(): Observable<any> {
        return this.http.get(endpoints.FETCH_TOP_DEPOSIT_BRANCHES)
            .pipe(map(this.extractData));
    }


    public fetchTotalIncome(): Observable<any> {
        return this.http.get(endpoints.FETCH_TOTAL_INCOME)
            .pipe(map(this.extractData));
    }
    public fetchTotalInvestment(): Observable<any> {
        return this.http.get(endpoints.FETCH_TOTAL_INVESTMENT)
            .pipe(map(this.extractData));
    }
    public fetchTotalDeposit(): Observable<any> {
        return this.http.get(endpoints.FETCH_TOTAL_DEPOSIT)
            .pipe(map(this.extractData));
    }
    public fetchTotalExpense(): Observable<any> {
        return this.http.get(endpoints.FETCH_TOTAL_EXPENSE)
            .pipe(map(this.extractData));
    }
    public fetchDepositDetail(): Observable<any> {
        return this.http.get(endpoints.FETCH_DEPOSIT_DETAIL)
            .pipe(map(this.extractData));
    }
}
