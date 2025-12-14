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
        // 1. Get the primary company record
        $company = $this->getPrimaryCompany();
        // 2. Prepare the data array by mapping request keys to database columns
        $updateData = [
            'name' => $data['name'] ?? '',
            'code' => $data['code'] ?? '',
            'vat_code' => $data['vatcode'] ?? '',
            'street' => $data['street'] ?? '',
            'city' => $data['city'] ?? '',
            'country' => $data['country'] ?? '',
            'phone' => $data['phone'] ?? '',
            'email' => $data['email'] ?? '',
            'web' => $data['web'] ?? '',
            'bank_name' => $data['bank'] ?? '', // map 'bank' to 'bank_name'
            'bank_account' => $data['bankaccount'] ?? '', // map 'bankaccount' to 'bank_account'
        ];

        // 3. Update the model attributes
        $company->fill($updateData);

        // 4. Save the changes
        $company->save();

        return $company;
    }
}