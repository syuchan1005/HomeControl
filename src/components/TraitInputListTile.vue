<template>
  <v-list-tile>
    <span class="type">{{ type }}</span>
    <v-spacer/>
    <v-btn icon @click="showDialog = true">
      <v-icon small>fas fa-edit</v-icon>
    </v-btn>
    <v-btn icon @click="$emit('delete')">
      <v-icon small>fas fa-trash</v-icon>
    </v-btn>

    <v-dialog v-model="showDialog" class="state-dialog" persistent
              max-width="600px" :fullscreen="$vuetify.breakpoint.xs">
      <v-card>
        <v-card-text v-if="type === 'Brightness'">
          <command-field v-model="info.getCommand" label="getCommand (void -> number{0-100})"/>
          <command-field v-model="info.setCommand" label="setCommand (boolean -> number{0-100})"/>
        </v-card-text> <!-- OK -->
        <v-card-text v-else-if="type === 'CameraStream'">
          <v-select
            v-model="info.supportedProtocols"
            :items="['progressive_mp4', 'hls', 'dash', 'smooth_stream']"
            attach
            chips
            label="Support Protocols"
            multiple
          ></v-select>
          <v-text-field
            hide-details
            label="URL (movie)"
            placeholder="ex. 'http://......'"
            v-model="info.url"/>
        </v-card-text>
        <v-card-text v-else-if="type === 'ColorSetting'">
          <v-text-field
            hide-details
            label="ColorTemperatureMinK"
            placeholder="ex. '2000'"
            v-model="info.tempMinK"/>
          <v-text-field
            hide-details
            label="ColorTemperatureMaxK"
            placeholder="ex. '9000'"
            v-model="info.tempMaxK"/>
          <v-text-field
            hide-details
            label="setCommand (boolean)"
            placeholder="ex. 'switch set %v'"
            v-model="info.setCommand"/>
          <v-text-field
            hide-details
            label="getCommand (return true or false)"
            placeholder="ex. 'switch get'"
            v-model="info.getCommand"/>
        </v-card-text>
        <v-card-text v-else-if="type === 'Dock'">
          <v-text-field
            hide-details
            label="getCommand (return true or false)"
            placeholder="ex. 'dock get'"
            v-model="info.getCommand"/>
        </v-card-text>
        <v-card-text v-else-if="type === 'FanSpeed'">
          <v-text-field
            hide-details
            label="setCommand (speedName)"
            placeholder="ex. 'fan set %v'"
            v-model="info.setCommand"/>
          <v-text-field
            hide-details
            label="getCommand (return SpeedName(String))"
            placeholder="ex. 'fan get'"
            v-model="info.getCommand"/>
          <v-list>
            <v-subheader>
              Speeds
              <v-spacer/>
              <v-btn icon @click="() => {
            if (!info.speeds) $set(info, 'speeds', []);
            info.speeds.push({});
          }">
                <v-icon>fa fa-plus</v-icon>
              </v-btn>
            </v-subheader>
            <v-list-tile v-for="(speed, i) in info.speeds" :key="i"
                         class="height-auto-tile">
              <v-card>
                <div style="padding-left: 10px;">
                  <div style="display: flex">
                    <v-text-field
                      hide-details
                      label="SpeedName"
                      v-model="speed.speed_name"/>
                    <v-btn icon @click="info.speeds.splice(i, 1)">
                      <v-icon small>fa fa-trash</v-icon>
                    </v-btn>
                  </div>
                  <v-card style="margin: 5px;">
                    <v-list>
                      <v-subheader>
                        Values
                        <v-spacer/>
                        <v-btn icon @click="() => {
                      if (!speed.speed_values) $set(speed, 'speed_values', []);
                      speed.speed_values.push({});
                    }">
                          <v-icon>fa fa-plus</v-icon>
                        </v-btn>
                      </v-subheader>
                      <v-list-tile v-for="(lang, i) in speed.speed_values" :key="i"
                                   class="height-auto-tile">
                        <v-text-field v-model="lang.lang" label="lang" style="max-width: 4rem;"/>
                        <v-combobox v-model="lang.speed_synonym" label="speed_synonym"
                                    chips multiple append-icon="" style="margin-left: 10px"/>

                        <v-btn icon @click="speed.speed_values.splice(i, 1)">
                          <v-icon small>fa fa-trash</v-icon>
                        </v-btn>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </div>
              </v-card>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-text v-else-if="type === 'Locator'">
          <v-text-field
            hide-details
            label="getCommand (return true or false)"
            placeholder="ex. 'dock get'"
            v-model="info.getCommand"/>
        </v-card-text>
        <v-card-text v-else-if="type === 'Modes'">
          <v-text-field
            hide-details
            label="setCommand (boolean)"
            placeholder="ex. 'switch set %v'"
            v-model="info.setCommand"/>
          <v-text-field
            hide-details
            label="getCommand (return true or false)"
            placeholder="ex. 'switch get'"
            v-model="info.getCommand"/>
          <v-list>
            <v-subheader>
              Modes
              <v-spacer/>
              <v-btn icon @click="() => {
            if (!info.modes) $set(info, 'modes', []);
            info.modes.push({});
          }">
                <v-icon>fa fa-plus</v-icon>
              </v-btn>
            </v-subheader>
            <v-list-tile v-for="(mode, i) in info.modes" :key="i"
                         class="height-auto-tile">
              <v-card>
                <div style="padding-left: 10px;">
                  <div style="display: flex">
                    <v-text-field
                      hide-details
                      label="ModeName"
                      v-model="mode.name"/>
                    <v-btn icon @click="info.modes.splice(i, 1)">
                      <v-icon small>fa fa-trash</v-icon>
                    </v-btn>
                  </div>
                  <v-list>
                    <v-subheader>
                      Values
                      <v-spacer/>
                      <v-btn icon @click="() => {
                      if (!mode.name_values) $set(mode, 'name_values', []);
                      mode.name_values.push({});
                    }">
                        <v-icon>fa fa-plus</v-icon>
                      </v-btn>
                    </v-subheader>
                    <v-list-tile v-for="(lang, i) in mode.name_values" :key="i"
                                 class="height-auto-tile">
                      <v-text-field v-model="lang.lang" label="lang" style="max-width: 4rem;"/>
                      <v-combobox v-model="lang.name_synonym" label="name_synonym"
                                  chips multiple append-icon="" style="margin-left: 10px"/>

                      <v-btn icon @click="mode.name_values.splice(i, 1)">
                        <v-icon small>fa fa-trash</v-icon>
                      </v-btn>
                    </v-list-tile>
                  </v-list>
                  <v-card style="margin: 5px;">
                    <v-list>
                      <v-subheader>
                        Settings
                        <v-spacer/>
                        <v-btn icon @click="() => {
                      if (!mode.settings) $set(mode, 'settings', []);
                      mode.settings.push({});
                    }">
                          <v-icon>fa fa-plus</v-icon>
                        </v-btn>
                      </v-subheader>
                      <v-list-tile v-for="(setting, i) in mode.settings" :key="i"
                                   class="height-auto-tile">
                        <v-card style="padding: 10px;">
                          <div style="display: flex">
                            <v-text-field
                              hide-details
                              label="SettingName"
                              v-model="setting.setting_name"/>
                            <v-btn icon @click="mode.settings.splice(i, 1)">
                              <v-icon small>fa fa-trash</v-icon>
                            </v-btn>
                          </div>
                          <v-list>
                            <v-subheader>
                              Values
                              <v-spacer/>
                              <v-btn icon @click="() => {
                      if (!setting.setting_values) $set(setting, 'setting_values', []);
                      setting.setting_values.push({});
                    }">
                                <v-icon>fa fa-plus</v-icon>
                              </v-btn>
                            </v-subheader>
                            <v-list-tile v-for="(langValue, i) in setting.setting_values" :key="i"
                                         class="height-auto-tile">
                              <v-text-field v-model="langValue.lang"
                                            label="lang" style="max-width: 4rem;"/>
                              <v-combobox v-model="langValue.setting_synonym"
                                          label="setting_synonym"
                                          chips multiple append-icon="" style="margin-left: 10px"/>

                              <v-btn icon @click="setting.setting_values.splice(i, 1)">
                                <v-icon small>fa fa-trash</v-icon>
                              </v-btn>
                            </v-list-tile>
                          </v-list>
                        </v-card>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </div>
              </v-card>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-text v-else-if="type === 'OnOff'">
          <command-field v-model="info.getCommand" label="getCommand (void -> boolean)"/>
          <command-field v-model="info.setCommand" label="setCommand (boolean -> boolean)"/>
        </v-card-text> <!-- OK -->
        <v-card-text v-else-if="type === 'RunCycle'">
          <v-text-field
            hide-details
            label="getCommand (return true or false)"
            placeholder="ex. 'switch get'"
            v-model="info.getCommand"/>
        </v-card-text>
        <v-card-text v-else-if="type === 'Scene'">
          <div style="display: flex">
            <v-spacer/>
            no fields
          </div>
        </v-card-text>
        <v-card-text v-else-if="type === 'StartStop'">
          <v-text-field
            hide-details
            label="getCommand (return true or false)"
            placeholder="ex. 'switch get'"
            v-model="info.getCommand"/>
          <v-text-field
            hide-details
            label="startCommand"
            placeholder="ex. 'switch get'"
            v-model="info.startCommand"/>
          <v-text-field
            hide-details
            label="stopCommand"
            placeholder="ex. 'switch get'"
            v-model="info.stopCommand"/>
          <v-text-field
            hide-details
            label="pauseCommand"
            placeholder="ex. 'switch get'"
            v-model="info.pauseCommand"/>
          <v-text-field
            hide-details
            label="unPauseCommand"
            placeholder="ex. 'switch get'"
            v-model="info.unPauseCommand"/>
        </v-card-text>
        <v-card-text v-else-if="type === 'TemperatureControl'">
          <v-text-field
            hide-details
            label="minTemp"
            placeholder="ex. 'switch set %v'"
            v-model="info.minTemp"/>
          <v-text-field
            hide-details
            label="maxTemp"
            placeholder="ex. 'switch get'"
            v-model="info.maxTemp"/>
          <v-text-field
            hide-details
            label="stepTemp"
            placeholder="ex. 'switch get'"
            v-model="info.stepTemp"/>
          <v-text-field
            hide-details
            label="getSetpointCommand"
            placeholder="ex. 'switch get'"
            v-model="info.getSetpointCommand"/>
          <v-text-field
            hide-details
            label="getNowTempCommand"
            placeholder="ex. 'switch get'"
            v-model="info.getNowTempCommand"/>
          <v-text-field
            hide-details
            label="setCommand"
            placeholder="ex. 'switch set %v'"
            v-model="info.setCommand"/>
        </v-card-text>
        <v-card-text v-else-if="type === 'TemperatureSetting'">
          <v-combobox v-model="info.modes" label="Modes" chips multiple append-icon=""/>
          <v-text-field
            hide-details
            label="getCommand (return true or false)"
            placeholder="ex. 'switch get'"
            v-model="info.getCommand"/>
          <v-text-field
            hide-details
            label="setCommand (boolean)"
            placeholder="ex. 'switch set %v'"
            v-model="info.setCommand"/>
          <v-text-field
            hide-details
            label="setHighCommand (boolean)"
            placeholder="ex. 'switch set %v'"
            v-model="info.setHighCommand"/>
          <v-text-field
            hide-details
            label="setLowCommand (boolean)"
            placeholder="ex. 'switch set %v'"
            v-model="info.setLowCommand"/>
          <v-text-field
            hide-details
            label="setModeCommand (boolean)"
            placeholder="ex. 'switch set %v'"
            v-model="info.setModeCommand"/>
        </v-card-text>
        <v-card-text v-else-if="type === 'Toggles'">
          <command-field v-model="info.getCommand" label="getCommand (object -> object)" />
          <command-field v-model="info.setCommand" label="setCommand (object -> object)" />
          <name-input-with-synonyms
            data-name="Toggle"
            :items="info.toggles"
            name-label="ToggleName" />
        </v-card-text> <!-- OK -->
        <v-card-text v-else>
          <v-spacer/>
          <span>{{ info }}</span>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" outline @click="showDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list-tile>
</template>

<script>
import CommandField from './CommandField.vue';
import InputNameWithSynonyms from './InputNameWithSynonyms.vue';

export default {
  name: 'TraitInputListTile',
  components: { NameInputWithSynonyms: InputNameWithSynonyms, CommandField },
  props: {
    type: {
      type: String,
    },
    info: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      showDialog: false,
    };
  },
  /* events: { delete } */
};
</script>

<style lang="scss">
  .height-auto-tile > .v-list__tile {
    height: auto !important;

    .v-card {
      width: 100%;
    }
  }
</style>
