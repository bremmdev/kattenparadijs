targetScope = 'subscription'

param projectName string
param location string

resource rg 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: 'rg-${projectName}'
  location: location
}

module searchModule 'modules/searchModule.bicep' = {
  scope: rg
  params: {
    projectName: projectName
    location: location
  }
}
