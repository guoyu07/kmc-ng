import { Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { KalturaClient } from 'kaltura-ngx-client';
import { KalturaFilterPager } from 'kaltura-ngx-client/api/types/KalturaFilterPager';
import { SuggestionsProviderData } from '@kaltura-ng/kaltura-primeng-ui/auto-complete';
import { AppLocalization } from '@kaltura-ng/kaltura-common';
import { BrowserService } from 'app-shared/kmc-shell';
import { AreaBlockerMessage } from '@kaltura-ng/kaltura-ui';
import { PopupWidgetComponent, PopupWidgetStates } from '@kaltura-ng/kaltura-ui/popup-widget/popup-widget.component';
import { KalturaUser } from 'kaltura-ngx-client/api/types/KalturaUser';
import { KalturaUserFilter } from 'kaltura-ngx-client/api/types/KalturaUserFilter';
import { UserListAction } from 'kaltura-ngx-client/api/types/UserListAction';

@Component({
	selector: 'kBulkChangeOwner',
	templateUrl: './bulk-change-owner.component.html',
	styleUrls: ['./bulk-change-owner.component.scss']
})
export class BulkChangeOwner implements OnInit, OnDestroy, AfterViewInit {

	@Input() parentPopupWidget: PopupWidgetComponent;
	@Output() ownerChanged = new EventEmitter<KalturaUser>();

	public _loading = false;
	public _sectionBlockerMessage: AreaBlockerMessage;

	public _usersProvider = new Subject<SuggestionsProviderData>();
	public _owner: KalturaUser[] = null;
  public _disableApplyButton = true;

	private _searchUsersSubscription: ISubscription;
	private _parentPopupStateChangeSubscribe: ISubscription;
	private _confirmClose: boolean = true;

	constructor(private _kalturaServerClient: KalturaClient, private _appLocalization: AppLocalization, private _browserService: BrowserService) {
        this._convertUserInputToValidValue = this._convertUserInputToValidValue.bind(this); // fix scope issues when binding to a property
    }

	ngOnInit() {

	}

	ngAfterViewInit() {
		if (this.parentPopupWidget) {
			this._parentPopupStateChangeSubscribe = this.parentPopupWidget.state$
				.subscribe(event => {
					if (event.state === PopupWidgetStates.Open) {
						this._confirmClose = true;
					}
					if (event.state === PopupWidgetStates.BeforeClose) {
						if (event.context && event.context.allowClose) {
							if (this._owner && this._confirmClose) {
								event.context.allowClose = false;
								this._browserService.confirm(
									{
										header: this._appLocalization.get('applications.content.entryDetails.captions.cancelEdit'),
										message: this._appLocalization.get('applications.content.entryDetails.captions.discard'),
										accept: () => {
											this._confirmClose = false;
											this.parentPopupWidget.close();
										}
									}
								);
							}
						}
					}
				});
		}
	}

	ngOnDestroy() {
		this._parentPopupStateChangeSubscribe.unsubscribe();
	}

	public _searchUsers(event): void {
		this._usersProvider.next({suggestions: [], isLoading: true});

		if (this._searchUsersSubscription) {
			// abort previous request
			this._searchUsersSubscription.unsubscribe();
			this._searchUsersSubscription = null;
		}

		this._searchUsersSubscription = this._kalturaServerClient.request(
			new UserListAction(
				{
					filter: new KalturaUserFilter({
						idOrScreenNameStartsWith: event.query
					}),
					pager: new KalturaFilterPager({
						pageIndex: 0,
						pageSize: 30
					})
				}
			)
		)
			.cancelOnDestroy(this)
			.monitor('search owners')
			.subscribe(
				data => {
					const suggestions = [];
					(data.objects || []).forEach((suggestedUser: KalturaUser) => {
						let isSelectable = true;
						suggestions.push({
							name: suggestedUser.screenName + " (" + suggestedUser.id + ")",
							item: suggestedUser,
							isSelectable: isSelectable
						});
					});
					this._usersProvider.next({suggestions: suggestions, isLoading: false});
				},
				err => {
					this._usersProvider.next({
						suggestions: [],
						isLoading: false,
						errorMessage: <any>(err.message || err)
					});
				}
			);
	}

	public _convertUserInputToValidValue(value: string): any {
		let result = null;
		let tt = this._appLocalization.get('applications.content.entryDetails.users.unknownUser');

		if (value) {
			result =
				{
					id: value,
					screenName: value,
					__tooltip: tt,
					__class: 'userAdded'
				}
		}
		return result;
	}

	public _apply() {
    const [owner] = this._owner;
    if (owner instanceof KalturaUser) {
      this.ownerChanged.emit(owner);
      this._confirmClose = false;
      this.parentPopupWidget.close();
    } else {
      this._browserService.alert({
        message: this._appLocalization.get('applications.content.entryDetails.users.unknownUser')
      });
    }
	}

  public _updateApplyButtonState(): void {
    const [owner] = this._owner;
    this._disableApplyButton = !(owner instanceof KalturaUser);
  }
}

