ALTER TABLE troskovi
DROP CONSTRAINT IF EXISTS chk_status_validacije;

ALTER TABLE troskovi
ADD CONSTRAINT chk_status_validacije
CHECK (status_validacije IN ('NA_CEKANJU', 'VALIDAN', 'POTENCIJALNI_DUPLIKAT', 'ANOMALIJA', 'ODBIJEN', 'ZAKLJUCAN'));
