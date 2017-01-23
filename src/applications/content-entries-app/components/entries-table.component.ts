import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MenuItem, DataTable, Menu } from 'primeng/primeng';
import { AppLocalization } from '@kaltura-ng2/kaltura-common';
import { Entry } from './entries.component';
import {EntriesStore} from "kmc-content-ui/entries-store/entries-store.service";

@Component({
  selector: 'kEntriesTable',
  templateUrl: './entries-table.component.html',
  styleUrls: ['./entries-table.component.scss']
})
export class kEntriesTable implements AfterViewInit{

  @Input() entries: any[] = [];
  @Input() filter: any = {};
  @Input() selectedEntries: any[] = [];

  @Output()
  sortChanged = new EventEmitter<any>();
  @Output()
  actionSelected = new EventEmitter<any>();
  @Output()
  selectedEntriesChange = new EventEmitter<any>();

  @ViewChild('dataTable') private dataTable: DataTable;
  @ViewChild('actionsmenu') private actionsMenu: Menu;
  private actionsMenuEntryId: string = "";

  private items: MenuItem[];
  tableSelectedEntries: Entry[] = [];


  constructor(private appLocalization: AppLocalization, private entriesStore : EntriesStore) {
    this.buildMenu();

  }

  buildMenu() : void
  {
    this.items = [
      {label: this.appLocalization.get("applications.content.table.previewAndEmbed"), command: (event) => {
        this.onActionSelected("preview", this.actionsMenuEntryId);
      }},
      {label: this.appLocalization.get("applications.content.table.delete"), command: (event) => {
        this.onActionSelected("delete", this.actionsMenuEntryId);
      }},
      {label: this.appLocalization.get("applications.content.table.view"), command: (event) => {
        this.onActionSelected("view", this.actionsMenuEntryId);
      }}
    ];
  }

  ngAfterViewInit(){
    if (this.dataTable.scrollBody) {
      this.dataTable.scrollBody.onscroll = () => {
        if (this.actionsMenu){
          this.actionsMenu.hide();
        }
      }
    }
  }

  openActionsMenu(event, entryId){
    if (this.actionsMenu){
      this.actionsMenu.toggle(event);
      if (this.actionsMenuEntryId !== entryId){
        this.actionsMenu.show(event);
        this.actionsMenuEntryId = entryId;
      }
    }
  }

  onActionSelected(action, entryID){
    this.actionSelected.emit({"action": action, "entryID": entryID});
  }

  onSortChanged(event){
    this.sortChanged.emit(event);
  }

  onSelectionChange(event){
    this.selectedEntries = [];
    event.forEach((entry: Entry) => {
      this.selectedEntries.push(entry.id)
    });
    this.selectedEntriesChange.emit(this.selectedEntries);
  }

}
