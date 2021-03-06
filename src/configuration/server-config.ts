import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/delay';
import {globalConfig} from './global-config';

/*************************************
 * Developer Notice:
 * When you add/edit/remove server configuration you should sync the following places:
 * - this file > 'ServerConfigSchema' constant
 * - this file > 'ServerConfig' interface
 * - file 'server-config.template.json' (used by CI server)
 *
 * If you are modifing an External application (a.k.a standalone application):
 * - file '__local_machine_only__/README.md' > section 'Test external applications integration'
 * - for new external apps you should also update the zip file 'samples-for-tests-only.zip'
 *************************************/

export const ServerConfigSchema = {
    properties: {
        kalturaServer: {
            properties: {
                uri: {type: 'string'},
                previewUIConf: {type: 'number'},
                freeTrialExpiration: {
                    properties: {
                        enabled: {type: 'boolean'},
                        trialPeriodInDays: {type: 'number'}
                    },
                    required: ['enabled', 'trialPeriodInDays'],
                    additionalProperties: false
                }

            },
            required: ['uri', 'previewUIConf', 'freeTrialExpiration'],
            additionalProperties: false
        },
        cdnServers: {
            properties: {
                serverUri: {type: 'string'},
                securedServerUri: {type: 'string'}
            },
            required: ['serverUri', 'securedServerUri'],
            additionalProperties: false
        },
        externalApps: {
            properties: {
                studio: {
                    properties: {
                        enabled: {type: 'boolean'},
                        uri: {type: 'string'},
                        version: {type: 'string'},
                        html5_version: {type: 'string'},
                        html5lib: {type: 'string'},
                        showStudioV3: {type: 'boolean'}
                    },
                    required: ['enabled', 'uri', 'version', 'html5_version', 'html5lib'],
                    additionalProperties: false
                },
                studioV3: {
                    properties: {
                        enabled: {type: 'boolean'},
                        uri: {type: 'string'},
                        version: {type: 'string'},
                        html5_version: {type: 'string'},
                        html5lib: {type: 'string'},
                        showHTMLStudio: {type: 'boolean'}
                    },
                    required: ['enabled', 'uri', 'version', 'html5_version', 'html5lib'],
                    additionalProperties: false
                },
                usageDashboard: {
                    properties: {
                        enabled: {type: 'boolean'},
                        version: {type: 'string'},
                        uri: {type: 'string'},
                        uiConfId: {type: 'number'},
                        map_urls: { type: 'array', items: { type: 'string' } },
                        map_zoom_levels: {type: 'string'}
                    },
                    required: ['enabled', 'version', 'uri', 'uiConfId', 'map_urls', 'map_zoom_levels'],
                    additionalProperties: false
                },
                liveDashboard: {
                    properties: {
                        enabled: {type: 'boolean'},
                        uri: {type: 'string'},
                        version: {type: 'string'}
                    },
                    required: ['enabled', 'uri', 'version'],
                    additionalProperties: false
                },
                liveAnalytics: {
                    properties: {
                        enabled: {type: 'boolean'},
                        uri: {type: 'string'},
                      uiConfId: {type: 'number'},
                      version: {type: 'string'}
                    },
                    required: ['enabled', 'uri', 'version'],
                    additionalProperties: false
                },
                clipAndTrim: {
                  properties: {
                    enabled: {type: 'boolean'},
                    uri: {type: 'string'},
                    uiConfId: {type: 'string'},
                    version: {type: 'string'}
                  },
                  required: ['enabled', 'uri', 'uiConfId'],
                  additionalProperties: false
                },
                advertisements: {
                  properties: {
                    enabled: {type: 'boolean'},
                    uri: {type: 'string'},
                    uiConfId: {type: 'string'},
                    version: {type: 'string'}
                  },
                  required: ['enabled', 'uri', 'uiConfId'],
                  additionalProperties: false
                },
                kava: {
                    properties: {
                        enabled: {type: 'boolean'},
                        version: {type: 'string'},
                        uri: {type: 'string'}
                    },
                    required: ['enabled', 'version', 'uri'],
                    additionalProperties: false
                }
            },
            required: ['studio', 'usageDashboard', 'liveDashboard', 'kava'],
            additionalProperties: false
        },
        externalLinks: {
            properties: {
                previewAndEmbed: {
                    properties: {
                        embedTypes: {type: 'string'},
                        deliveryProtocols: {type: 'string'}
                    },
                    required: ['embedTypes', 'deliveryProtocols'],
                    additionalProperties: false
                },
                kaltura: {
                    properties: {
                        kmcOverview: {type: 'string'},
                        mediaManagement: {type: 'string'},
                        userManual: {type: 'string'},
                        support: {type: 'string'},
                        signUp: {type: 'string'},
                        contactUs: {type: 'string'},
                        upgradeAccount: {type: 'string'},
                        contactSalesforce: {type: 'string'}
                    },
                    required: ['userManual', 'support', 'signUp', 'contactUs', 'upgradeAccount', 'contactSalesforce'],
                    additionalProperties: false
                },
                entitlements: {
                    properties: {
                        manage: {type: 'string'}
                    },
                    required: ['manage'],
                    additionalProperties: false
                },
                uploads: {
                    properties: {
                        highSpeedUpload: {type: 'string'},
                        needHighSpeedUpload: {type: 'string'},
                        bulkUploadSamples: {type: 'string'}
                    },
                    required: ['highSpeedUpload', 'needHighSpeedUpload', 'bulkUploadSamples'],
                    additionalProperties: false
                },
                live: {
                    properties: {
                        akamaiEdgeServerIpURL: {type: 'string'}
                    },
                    required: ['akamaiEdgeServerIpURL'],
                    additionalProperties: false
                }
            },
            required: ['previewAndEmbed', 'kaltura', 'uploads', 'live'],
            additionalProperties: false
        }
    },
    required: ['kalturaServer', 'cdnServers', 'externalApps', 'externalLinks'],
    additionalProperties: false
};

export interface ServerConfig {
    kalturaServer: {
        uri: string,
        previewUIConf: number,
        freeTrialExpiration: {
            enabled: boolean,
            trialPeriodInDays: number
        }
    };
    cdnServers: {
        serverUri: string,
        securedServerUri: string
    };
    externalApps: {
        studio: {
            enabled: boolean,
            uri: string,
            version: string,
            html5_version: string,
            html5lib: string,
            showFlashStudio: boolean
        },
        studioV3: {
            enabled: boolean,
            uri: string,
            version: string,
            html5_version: string,
            html5lib: string,
            showFlashStudio: boolean
        },
        liveDashboard: {
            enabled: boolean,
            version: string,
            uri: string,
        },
        kava: {
            enabled: boolean,
            version: string,
            uri: string
        },
        usageDashboard: {
            enabled: boolean,
            version: string,
            uri: string,
            uiConfId: number,
            map_urls: string[],
            map_zoom_levels: string,
        },
        liveAnalytics: {
            enabled: boolean,
            version: string,
            uiConfId: number,
            uri: string
        },
        clipAndTrim: {
          enabled: boolean,
          uri: string,
          uiConfId: string,
          version: string,
        },
        advertisements: {
          enabled: boolean,
          uri: string,
          uiConfId: string,
          version: string,
        }
    };
    externalLinks: {
        previewAndEmbed: {
            embedTypes: string,
            deliveryProtocols: string
        },
        entitlements:{
            manage: string
        },
        kaltura: {
            userManual: string,
            kmcOverview: string,
            mediaManagement: string,
            support: string,
            signUp: string,
            contactUs: string,
            upgradeAccount: string,
            contactSalesforce: string,
        },
        uploads: {
            highSpeedUpload: string,
            needHighSpeedUpload: string,
            bulkUploadSamples: string
        },
        live: {
            akamaiEdgeServerIpURL: string
        }
    };
}

export const serverConfig: ServerConfig = <any>{};

export function getKalturaServerUri(suffix: string = ''): string {
    if (serverConfig.kalturaServer) {
        const useHttpsProtocol = globalConfig.kalturaServer.useSecuredProtocol;
        const serverEndpoint = serverConfig.kalturaServer.uri;
        return `${useHttpsProtocol ? 'https' : 'http'}://${serverEndpoint}${suffix}`;
    } else {
        throw new Error(`cannot provide kaltura server uri. server configuration wasn't loaded already`);
    }
}
