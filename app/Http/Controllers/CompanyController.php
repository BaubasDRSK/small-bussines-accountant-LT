<?php

namespace App\Http\Controllers;

// use App\Http\Requests\StoreCompanyRequest;
// use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $companyFull = Company::firstOrCreate(['company_id'=>1])->get();

        $company = $companyFull->map(function ($item) {
            return [
                'name' => $item['name'],
                'code' => $item['code'],
                'isvat' => $item['vat_status'],
                'vatcode' => $item['vat_code'],
                'street' => $item['street'],
                'city' => $item['city'],
                'country' => $item['country'],
                'phone' => $item['phone'],
                'email' => $item['email'],
                'web' => $item['web'],
                'bank' => $item['bank_name'],
                'bankaccount' => $item['bank_account'],
            ];
        });
        // dd($company);
        return Inertia::render('Settings', [
            'storeUrl' => route('settings-store'),
            'company'=>$company,
        ]);
    }

    /**
     * Show the form for creating a new resource. store-settings
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $company = Company::where('company_id', 1)->first();

        $company->name = $request->name ?? '';
        $company->code = $request->code ?? '';
        $company->vat_status = $request->isvat ?? '';
        $company->vat_code = $request->vatcode ?? '';
        $company->street = $request->street ?? '';
        $company->city = $request->city ?? '';
        $company->country = $request->country ?? '';
        $company->phone = $request->phone ?? '';
        $company->email = $request->email ?? '';
        $company->web = $request->web ?? '';
        $company->bank_name = $request->bank ?? '';
        $company->bank_account = $request->bankaccount ?? '';

        $company->save();
        return response()->json(
            [
                'message' => 'Company details stored',
                'type' => 'success',
            ],
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        //
    }
}
