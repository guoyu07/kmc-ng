import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DefaultFiltersList } from './default-filters-list';
import { AppLocalization } from '@kaltura-ng/kaltura-common/localization/app-localization.service';
import { KMCPermissions, KMCPermissionsService } from 'app-shared/kmc-shared/kmc-permissions';
import { KalturaBulkUploadObjectType } from 'kaltura-ngx-client/api/types/KalturaBulkUploadObjectType';

export interface RefineListItem {
  value: string;
  label: string;
}

export class RefineList {
  public items: RefineListItem[] = [];

  constructor(public name: string, public label: string) {
  }
}

@Injectable()
export class BulkLogRefineFiltersService {
  constructor(private _appLocalization: AppLocalization,
              private _permissionsService: KMCPermissionsService) {

  }

  public getFilters(): Observable<RefineList[]> {
    return Observable.of(this._buildDefaultFiltersGroup());
  }

  private _buildDefaultFiltersGroup(): RefineList[] {
    const hasEndUserPermission = this._permissionsService.hasPermission(KMCPermissions.FEATURE_END_USER_MANAGE);
    return DefaultFiltersList.map((list) => {
      const refineList = new RefineList(
        list.name,
        this._appLocalization.get(`applications.content.bulkUpload.filters.${list.label}`)
      );

      list.items.forEach((item: any) => {
        if (item.value === KalturaBulkUploadObjectType.user && !hasEndUserPermission) {
          return;
        }

        refineList.items.push({
          value: item.value,
          label: this._appLocalization.get(`applications.content.bulkUpload.filters.${item.label}`)
        });
      });

      return refineList;
    });
  }
}
