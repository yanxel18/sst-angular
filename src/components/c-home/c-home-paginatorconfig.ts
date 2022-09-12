import { MatPaginatorIntl } from '@angular/material/paginator/paginator-intl';
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Custom_Label:';

  return customPaginatorIntl;
}
