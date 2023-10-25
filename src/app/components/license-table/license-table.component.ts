import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LicenseTableDataSource } from './license-table-datasource';
import { License } from 'src/app/models/license.model';
import { LicenseService } from 'src/app/services/license.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-license-table',
  templateUrl: './license-table.component.html',
  styleUrls: ['./license-table.component.scss'],
})
export class LicenseTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<License>;
  dataSource: LicenseTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'Server',
    'FeatureName',
    'TotalIssued',
    'TotalInUse',
    'UserName',
    'Computer',
    'FeatureVersion',
    'LicenseHandle',
    'ProgramStartDate',
  ];

  constructor(private licenseService: LicenseService) {}

  ngOnInit(): void {
    this.dataSource = new LicenseTableDataSource(this.licenseService);
    this.dataSource.loadLicenses();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    this.paginator.page.pipe(tap(() => this.loadLicensesPage())).subscribe();
  }

  loadLicensesPage() {
    this.dataSource.loadLicenses();
  }
}
