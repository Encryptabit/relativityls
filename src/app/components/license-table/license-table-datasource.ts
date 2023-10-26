import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, tap } from 'rxjs/operators';
import { Observable, merge, BehaviorSubject } from 'rxjs';
import { LicenseService } from 'src/app/services/license.service';
import { License } from 'src/app/models/license.model';

/**
 * Data source for the LicenseTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LicenseTableDataSource extends DataSource<License> {
  data: License[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  private licensesSubject = new BehaviorSubject<License[]>([]);

  constructor(
    private licenseService: LicenseService,
    private dataIteration?: string
  ) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<License[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        this.licensesSubject.asObservable(),
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this.licensesSubject.complete();
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: License[]): License[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: License[]): License[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'Server':
          return compare(a.Server, b.Server, isAsc);
        case 'FeatureName':
          return compare(a.FeatureName, b.FeatureName, isAsc);
        case 'TotalIssued':
          return compare(+a.TotalIssued, +b.TotalIssued, isAsc);
        case 'TotalInUse':
          return compare(+a.TotalInUse, +b.TotalInUse, isAsc);
        case 'UserName':
          return compare(a.UserName, b.UserName, isAsc);
        case 'Computer':
          return compare(a.Computer, b.Computer, isAsc);
        case 'FeatureVersion':
          return compare(a.FeatureVersion, b.FeatureVersion, isAsc);
        case 'LicenseHandle':
          return compare(a.LicenseHandle, b.LicenseHandle, isAsc);
        case 'ProgramStartDate':
          return compare(a.ProgramStartDate, b.ProgramStartDate, isAsc);
        case 'Duration':
          return compare(a.ProgramStartDate, b.ProgramStartDate, isAsc);
        default:
          return 0;
      }
    });
  }

  public loadLicenses() {
    this.licenseService
      .getLicenseInformation(`data${this.dataIteration}.json`)
      .pipe(tap((value: License[]) => (this.data = [...this.data, ...value])))
      .subscribe((result) => {
        this.licensesSubject.next(result as License[]);
      });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
