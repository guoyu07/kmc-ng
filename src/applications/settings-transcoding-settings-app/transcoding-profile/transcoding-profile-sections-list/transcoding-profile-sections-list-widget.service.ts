import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AppLocalization } from '@kaltura-ng/kaltura-common';
import { SectionsList } from './sections-list';
import { TranscodingProfileWidget } from '../transcoding-profile-widget';
import { KalturaConversionProfileWithAsset } from '../../transcoding-profiles/transcoding-profiles-store/base-transcoding-profiles-store.service';

export interface SectionWidgetItem {
  label: string;
  isValid: boolean;
  attached: boolean;
  key: string;
}

@Injectable()
export class TranscodingProfileSectionsListWidget extends TranscodingProfileWidget implements OnDestroy {
  private _sections = new BehaviorSubject<SectionWidgetItem[]>([]);
  public sections$: Observable<SectionWidgetItem[]> = this._sections.asObservable();

  constructor(private _appLocalization: AppLocalization) {
    super('sectionsList');
  }

  ngOnDestroy() {

  }

  private _initialize(): void {
    this.form.widgetsState$
      .cancelOnDestroy(this)
      .subscribe(
        sectionsState => {
          this._sections.getValue().forEach((section: SectionWidgetItem) => {
            const sectionState = sectionsState[section.key];
            const isValid = (!sectionState || sectionState.isBusy || sectionState.isValid || !sectionState.isActive);
            const isAttached = (!!sectionState && sectionState.isAttached);

            if (section.attached !== isAttached || section.isValid !== isValid) {
              section.attached = isAttached;
              section.isValid = isValid;
            }
          });
        }
      );
  }

  private _isSectionEnabled(sectionKey: string, profile: KalturaConversionProfileWithAsset): boolean {
    return true;
  }

  protected onDataLoading(dataId: any): void {
    this._clearSectionsList();
  }

  protected onActivate(firstTimeActivating: boolean): void {
    if (firstTimeActivating) {
      this._initialize();
    }
  }

  protected onDataLoaded(data: KalturaConversionProfileWithAsset): void {
    this._reloadSections(data);
  }

  /**
   * Do some cleanups if needed once the section is removed
   */
  protected onReset() {

  }

  private _clearSectionsList(): void {
    this._sections.next([]);

  }

  private _reloadSections(profile: KalturaConversionProfileWithAsset): void {
    const sections = [];
    const formWidgetsState = this.form.widgetsState;

    if (profile) {
      SectionsList.forEach((section) => {

        const sectionFormWidgetState = formWidgetsState ? formWidgetsState[section.key] : null;
        const isSectionActive = sectionFormWidgetState && sectionFormWidgetState.isActive;

        if (this._isSectionEnabled(section.key, profile)) {
          sections.push({
            label: this._appLocalization.get(section.label),
            active: isSectionActive,
            hasErrors: sectionFormWidgetState ? sectionFormWidgetState.isValid : false,
            key: section.key
          });
        }
      });
    }

    this._sections.next(sections);
  }
}
