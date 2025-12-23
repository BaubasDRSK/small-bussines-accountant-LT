<?php

namespace App\Repositories;

use App\Models\Company;

class CompanyRepository
{
    /**
     * Retrieves the primary company record, creating it if it doesn't exist.
     * * @return Company
     */
    public function getPrimaryCompany(): Company
    {
        // Use firstOrCreate to get the record with company_id = 1
        // and create it with default attributes if it doesn't exist.
        return Company::firstOrCreate(['company_id' => 1]);
    }

    /**
     * Updates the primary company record with the given data.
     *
     * @param array $data
     * @return Company
     */
    public function updatePrimaryCompany(array $data): Company
    {
        $company = $this->getPrimaryCompany();
        $company->fill($data);

        $company->save();

        return $company;
    }
}