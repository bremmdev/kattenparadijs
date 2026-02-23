targetScope = 'resourceGroup'

param projectName string
param location string

resource cognitiveServices 'Microsoft.CognitiveServices/accounts@2025-10-01-preview' = {
  location: location
  name: '${projectName}-cognitive-services'
  kind: 'ComputerVision'
  sku: {
    name: 'F0'
  }
  properties: {
    publicNetworkAccess: 'Enabled'
  }
}
