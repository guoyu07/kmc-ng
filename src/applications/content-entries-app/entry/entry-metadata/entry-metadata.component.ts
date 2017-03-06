import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit,OnInit, OnDestroy } from '@angular/core';
import { MenuItem, Menu } from 'primeng/primeng';
import { ISubscription } from 'rxjs/Subscription';
import { AppLocalization } from '@kaltura-ng2/kaltura-common';
import { EntryMetadataHandler } from './entry-metadata-handler';

@Component({
    selector: 'kEntryMetadata',
    templateUrl: './entry-metadata.component.html',
    styleUrls: ['./entry-metadata.component.scss']
})
export class EntryMetadata implements AfterViewInit, OnInit, OnDestroy {

	// temp arrays for custom metadata [TODO] - remove
	textItems = ["item", "item", "item"];
	dateItems = ["item", "item", "item"];
	listItems = [{"label": "list item 1", "value" : 1}, {"label": "list item 2", "value" : 2}, {"label": "list item 3", "value" : 3}];
	entries = ["Entry 1", "Entry 2", "Entry 3"];
	selectedEntries = [];

    public _loading = false;
    public _loadingError = null;
	public _jumpToMenu: MenuItem[] = [];

    constructor(private _appLocalization: AppLocalization, public _handler : EntryMetadataHandler) {
    }


    ngOnInit() {
    	this._jumpToMenu = [
		    {label: "Section 1", command: (event) => {
			    this._jumpTo("Section 1");
		    }},
		    {label: "Section 2", command: (event) => {
			    this._jumpTo("Section 2");
		    }},
		    {label: "Section 3", command: (event) => {
			    this._jumpTo("Section 3");
		    }}
	    ];
    }

    ngOnDestroy() {
    }


    ngAfterViewInit() {

    }

    private _jumpTo(section: string){
    	alert("Jump to: "+section);
    }

    _onLoadingAction(actionKey: string) {
        if (actionKey === 'retry') {

        }
    }
}
