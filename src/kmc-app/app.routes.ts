import {RouterModule, Routes} from '@angular/router';
import {AppBootstrap, AuthCanActivate} from 'app-shared/kmc-shell';

import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ErrorComponent} from './components/error/error.component';

const routes: Routes = <Routes>[
  {
    path: 'error', component: ErrorComponent
  },
  {
    path: '', canActivate: [AppBootstrap],
    children: [
      { path: 'login', component: LoginComponent },
      {
          path: '', redirectTo: '/content/entries/list', pathMatch: 'full'
      },
      {
        path: '', component: DashboardComponent, canActivate: [AuthCanActivate], children: [
        {
          path: 'content', children: [
          { path: '', redirectTo: 'entries', pathMatch: 'full' },
          {
            path: 'entries',
            loadChildren: '../applications/content-entries-app/content-entries-app.module#ContentEntriesAppModule'
          },
          {
            path: 'playlists',
            loadChildren: '../applications/content-playlists-app/content-playlists-app.module#ContentPlaylistsAppModule'
          },
          {
            path: 'categories',
            loadChildren: '../applications/content-categories-app/content-categories-app.module#ContentCategoriesAppModule'
          },
          {
            path: 'syndication',
            loadChildren: '../applications/content-syndication-app/content-syndication-app.module#ContentSyndicationAppModule'
          },
          {
            path: 'upload-control',
            loadChildren: '../applications/content-upload-control-app/content-upload-control-app.module#ContentUploadControlAppModule'
          },
          {
            path: 'drop-folders',
            loadChildren: '../applications/content-drop-folders-app/content-drop-folders-app.module#ContentDropFoldersAppModule'
          },
          {
            path: 'bulk',
            loadChildren: '../applications/content-bulk-log-app/content-bulk-log-app.module#ContentBulkLogAppModule'
          },
            {
                path: 'moderation',
                loadChildren: '../applications/content-moderation-app/content-moderation-app.module#ContentModerationAppModule'
            }
        ]},
        {
          path: 'settings', children: [
            { path: '', redirectTo: 'accountSettings', pathMatch: 'full' },
            {
              path: 'accountSettings',
              loadChildren: '../applications/settings-account-settings-app/settings-account-settings-app.module#SettingsAccountSettingsAppModule'
            },
            {
              path: 'integrationSettings',
            loadChildren: '../applications/settings-integration-settings-app/settings-integration-settings-app.module#SettingsIntegrationSettingsAppModule'
          },
          {
            path: 'accountInformation',
            loadChildren: '../applications/settings-account-information-app/settings-account-information-app.module#SettingsAccountInformationAppModule'
          },
          {
            path: 'accessControl',
            loadChildren: '../applications/settings-access-control-app/settings-access-control-app.module#SettingsAccessControlAppModule'
          },
            {
                path: 'metadata',
                loadChildren: '../applications/settings-custom-data-app/settings-custom-data-app.module#SettingsCustomDataAppModule'
            },
            {
                path: 'myUserSettings',
                loadChildren: '../applications/settings-my-user-settings-app/settings-my-user-settings-app.module#SettingsMyUserSettingsAppModule'
            },
            {
              path: 'transcoding',
              loadChildren: '../applications/settings-transcoding-settings-app/settings-transcoding-settings-app.module#SettingsTranscodingSettingsAppModule'
            }
        ]
        },
        {
          path: 'administration', children: [
            { path: '', redirectTo: 'users', pathMatch: 'full' },
            {
              path: 'roles',
              loadChildren: '../applications/administration-roles-app/administration-roles-app.module#AdministrationRolesAppModule'
            },
          {
            path: 'users',
            loadChildren: '../applications/administration-users-app/administration-users-app.module#AdministrationUsersAppModule'
          }
          ]
        },
        { path: 'studio', loadChildren: '../applications/studio-app/studio-app.module#StudioAppModule' },
        { path: 'usageDashboard', loadChildren: '../applications/usage-dashboard-app/usage-dashboard-app.module#UsageDashboardAppModule' },
        {
          path: 'analytics', children: [
          { path: '', redirectTo: 'liveAnalytics', pathMatch: 'full' },
          { path: 'kava', loadChildren: '../applications/analytics-kava-app/analytics-kava-app.module#AnalyticsKavaAppModule' },
          { path: 'liveAnalytics', loadChildren: '../applications/analytics-live-app/analytics-live-app.module#AnalyticsLiveAppModule' },
        ]
        },
      ]
      }
    ]
  },
  {
    path: '**', redirectTo: '/', pathMatch: 'full'
  }
];

export const routing = RouterModule.forRoot(routes);
