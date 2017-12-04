import { KalturaBulkUploadObjectType } from 'kaltura-ngx-client/api/types/KalturaBulkUploadObjectType';
import { KalturaDetachedResponseProfile } from 'kaltura-ngx-client/api/types/KalturaDetachedResponseProfile';
import { KalturaResponseProfileType } from 'kaltura-ngx-client/api/types/KalturaResponseProfileType';
import { KalturaBulkUploadFilter } from 'kaltura-ngx-client/api/types/KalturaBulkUploadFilter';
import { BulkListAction } from 'kaltura-ngx-client/api/types/BulkListAction';
import { RequestFactory } from '@kaltura-ng/kaltura-common';

export class BulkLogUploadChanges implements RequestFactory<BulkListAction> {

  public uploadedOn: Date;

  constructor() {
  }

  create(): BulkListAction {
    const bulkUploadObjectTypeIn = [
      KalturaBulkUploadObjectType.entry,
      KalturaBulkUploadObjectType.category,
      KalturaBulkUploadObjectType.user,
      KalturaBulkUploadObjectType.categoryUser
    ];

    if (this.uploadedOn === null) {
      return null;
    } else {
      return new BulkListAction({
        bulkUploadFilter: new KalturaBulkUploadFilter({
          bulkUploadObjectTypeIn: bulkUploadObjectTypeIn.join(','),
          uploadedOnGreaterThanOrEqual: this.uploadedOn
        }),
        responseProfile: new KalturaDetachedResponseProfile({
          type: KalturaResponseProfileType.includeFields,
          fields: 'id,status,uploadedOn'
        })
      });
    }
  }
}
