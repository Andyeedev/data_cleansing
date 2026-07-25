# SQL Server Setup/Reset Script
# Usage: .\sqlserver-setup.ps1 -Action create
#        .\sqlserver-setup.ps1 -Action delete
#        .\sqlserver-setup.ps1 -Action reset
#        .\sqlserver-setup.ps1 -Action list

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("create", "delete", "reset", "list")]
    [string]$Action
)

$ServerName = "sqlmssqldev2026"
$ResourceGroup = "rg-migration-dev"
$Databases = @("migration-source", "migration-target")
$AdminUser = "sqladmin"
$AdminPassword = "MigrationDev2026!"

switch ($Action) {
    "create" {
        Write-Host "Creating SQL Server..." -ForegroundColor Yellow
        az sql server create `
            --name $ServerName `
            --resource-group $ResourceGroup `
            --location centralus `
            --admin-user $AdminUser `
            --admin-password $AdminPassword `
            -o table 2>$null

        foreach ($db in $Databases) {
            Write-Host "Creating database: $db..." -ForegroundColor Yellow
            az sql db create `
                --server $ServerName `
                --resource-group $ResourceGroup `
                --name $db `
                --edition Basic `
                --capacity 5 `
                -o table 2>$null
        }

        Write-Host "Adding firewall rule..." -ForegroundColor Yellow
        $ip = (az rest --method get --url "https://api.ipify.org?format=json" --query "ip" -o tsv 2>$null)
        az sql server firewall-rule create `
            --server $ServerName `
            --resource-group $ResourceGroup `
            --name AllowMyIP `
            --start-ip-address $ip `
            --end-ip-address $ip `
            -o table 2>$null

        Write-Host "`nSQL Server setup complete!" -ForegroundColor Green
        Write-Host "Server: $ServerName.database.windows.net"
        Write-Host "Databases: $($Databases -join ', ')"
        Write-Host "User: $AdminUser"
    }

    "delete" {
        foreach ($db in $Databases) {
            Write-Host "Deleting database: $db..." -ForegroundColor Yellow
            az sql db delete `
                --server $ServerName `
                --resource-group $ResourceGroup `
                --name $db `
                --yes `
                -o table 2>$null
        }

        Write-Host "Deleting server..." -ForegroundColor Yellow
        az sql server delete `
            --name $ServerName `
            --resource-group $ResourceGroup `
            --yes `
            -o table 2>$null

        Write-Host "`nSQL Server deleted!" -ForegroundColor Green
    }

    "reset" {
        Write-Host "Resetting SQL Server (delete + create)..." -ForegroundColor Yellow
        & $PSCommandPath -Action delete
        Start-Sleep -Seconds 10
        & $PSCommandPath -Action create
        Write-Host "`nReset complete!" -ForegroundColor Green
    }

    "list" {
        Write-Host "Listing databases on $ServerName..." -ForegroundColor Yellow
        az sql db list `
            --server $ServerName `
            --resource-group $ResourceGroup `
            -o table
    }
}
