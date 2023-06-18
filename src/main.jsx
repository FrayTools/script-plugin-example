import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import FrayToolsPluginCore.js and BaseScriptAssetPlugin.js
import FrayToolsPluginCore from '@fraytools/plugin-core';
import BaseScriptAssetPlugin from '@fraytools/plugin-core/lib/base/BaseScriptAssetPlugin';

/**
 * Example view for the script asset plugin.
 */
class MyScriptAssetPlugin extends BaseScriptAssetPlugin {
  constructor(props) {
    super(props);

    this.onScriptChanged = this.onScriptChanged.bind(this);

    this.state = {
    };
  }

  /**
   * This function will be triggered if new props are received at any point prevProps 
   */
  componentDidUpdate(prevProps) {
    // Add implementation to handle new props being received here
  }

  /**
   * Force this component to re-render when parent window sends new props
   */
  onPropsUpdated(props) {
    ReactDOM.render(<MyScriptAssetPlugin {...props} />, document.querySelector('.MyScriptAssetPluginWrapper'));
  }

  /**
   * Update script text when the parent changes
   */
   onScriptChanged(event) {
     // Clone asset metadata
     var scriptAssetMetadata = {};
     for (var key in this.props.assetMetadata) {
       if (!this.props.assetMetadata.hasOwnProperty(key)) {
         continue;
       }
       scriptAssetMetadata[key] = this.props.assetMetadata[key];
     }
     // Assign updated script text
     scriptAssetMetadata.script = event.target.value;

     // Sync with parent window
     FrayToolsPluginCore.assetMetadataSync(scriptAssetMetadata);
  }

  render() {
    if (this.props.configMode) {
      // If configMode is enabled, display a different view specifically for configuring plugin metadata
      return (
        <div style={{ color: '#ffffff', background: '#000000' }}>
          <p>{JSON.stringify(MANIFEST_JSON)}</p>
          <p>Hello world! This is an example configuration view for a ScriptAsset plugin.</p>
          <p>Here you would provide a UI for assigning custom settings to persist between sessions using 'pluginConfigSyncRequest' postMessage() commands sent to the parent window. This data will then be persisted within the current FrayTools project settings file.</p>
        </div>
      );
    }

    // Display some basic information
    return (
      <div className="MyScriptAssetComponent" style={{ color: '#ffffff', background: '#000000' }}>
        <p>Hello world! This is an example editor view for a ScriptAsset plugin. Implement a custom UI here for editing your script, and pass the updated script contents and asset metadata back to the parent window with a 'pluginAssetMetadataSyncRequest' postMessage() command. This data will be persisted in the asset's metadata file.</p>
        <p>See the original text from the script asset below (and editing it will affect the real script!):</p>
        <textarea style={{ width: '100%', height: '400px' }} defaultValue={this.props.assetMetadata.script} onChange={this.onScriptChanged}/>
        <p></p>
        <p></p>
      </div>
    );
  }
}

// Informs FrayToolsPluginCore the default config metadata for MyScriptAssetPlugin when it first gets initialized
FrayToolsPluginCore.PLUGIN_CONFIG_METADATA_DEFAULTS = { version: MANIFEST_JSON.version };

FrayToolsPluginCore.migrationHandler = (configMetadata) => {
  // Compare configMetadata.version here with your latest manifest version and perform any necessary migrations for compatibility
};
FrayToolsPluginCore.setupHandler = (props) => {
  // Create a new container for the plugin
  var appContainer = document.createElement('div');
  appContainer.className = 'MyScriptAssetPluginWrapper';
  document.body.appendChild(appContainer);

  // Load the component with its props into the document body
  ReactDOM.render(<MyScriptAssetPlugin {...props}/>, appContainer);
};
