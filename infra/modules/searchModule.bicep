targetScope = 'resourceGroup'

param projectName string
param location string

resource search 'Microsoft.Search/searchServices@2025-05-01' = {
  location: location
  name: '${projectName}-search'
  sku: {
    name: 'free'
  }
  properties: {
    hostingMode: 'Default'
    publicNetworkAccess: 'Enabled'
    replicaCount: 1
    partitionCount: 1
  }
}
