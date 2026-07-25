# PostgreSQL Setup/Reset Script
# Usage: .\postgresql-setup.ps1 -Action create
#        .\postgresql-setup.ps1 -Action stop
#        .\postgresql-setup.ps1 -Action start
#        .\postgresql-setup.ps1 -Action delete
#        .\postgresql-setup.ps1 -Action list

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("create", "stop", "start", "delete", "list")]
    [string]$Action
)

$ServerName = "psql-migdev-pg1"
$ResourceGroup = "rg-migration-dev"
$Databases = @("migration_engine", "migration_source", "migration_target")
$AdminUser = "psqladmin"
$AdminPassword = "MigrationDev2026!"

switch ($Action) {
    "create" {
        Write-Host "Creating PostgreSQL server..." -ForegroundColor Yellow
        az postgres flexible-server create `
            --resource-group $ResourceGroup `
            --name $ServerName `
            --admin-user $AdminUser `
            --admin-password $AdminPassword `
            --sku-name Standard_B1ms `
            --tier Burstable `
            --storage-size 32 `
            --version 15 `
            --location uksouth `
            --yes `
            -o table 2>$null

        foreach ($db in $Databases) {
            Write-Host "Creating database: $db..." -ForegroundColor Yellow
            az postgres flexible-server db create `
                --resource-group $ResourceGroup `
                --server-name $ServerName `
                --database-name $db `
                -o table 2>$null
        }

        Write-Host "`nPostgreSQL setup complete!" -ForegroundColor Green
        Write-Host "Server: $ServerName.postgres.database.azure.com"
        Write-Host "Databases: $($Databases -join ', ')"
    }

    "stop" {
        Write-Host "Stopping PostgreSQL server..." -ForegroundColor Yellow
        az postgres flexible-server stop --name $ServerName --resource-group $ResourceGroup -o table
        Write-Host "`nServer stopped. Compute charges paused." -ForegroundColor Green
        Write-Host "Storage charges (~$3.68/month) continue." -ForegroundColor Yellow
    }

    "start" {
        Write-Host "Starting PostgreSQL server..." -ForegroundColor Yellow
        az postgres flexible-server start --name $ServerName --resource-group $ResourceGroup -o table
        Write-Host "`nServer started!" -ForegroundColor Green
    }

    "delete" {
        Write-Host "Deleting PostgreSQL server..." -ForegroundColor Yellow
        az postgres flexible-server delete --name $ServerName --resource-group $ResourceGroup --yes -o table
        Write-Host "`nServer deleted!" -ForegroundColor Green
    }

    "list" {
        Write-Host "Listing databases on $ServerName..." -ForegroundColor Yellow
        az postgres flexible-server db list `
            --resource-group $ResourceGroup `
            --server-name $ServerName `
            -o table
    }
}
