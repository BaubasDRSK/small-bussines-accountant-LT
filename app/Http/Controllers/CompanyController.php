<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyStoreUpdateRequest; // <-- New Request
use App\Models\Company;
use App\Repositories\CompanyRepository; // <-- New Repository
use Inertia\Inertia;

class CompanyController extends Controller
{
    // Inject the Repository into the Controller
    protected $companyRepository;

    public function __construct(CompanyRepository $companyRepository)
    {
        $this->companyRepository = $companyRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Logic moved to Repository: getPrimaryCompany()
        // Note: The original code returned a Collection after firstOrCreate, which is incorrect. 
        // We'll get the single Company model from the repository.
        $companyModel = $this->companyRepository->getPrimaryCompany();

        // We wrap the single model in an array for Inertia to match the original structure,
        // and map the keys for the frontend
        $company = [
            'name' => $companyModel->name,
            'code' => $companyModel->code,
            'vatcode' => $companyModel->vat_code, // DB: vat_code, FE: vatcode
            'street' => $companyModel->street,
            'city' => $companyModel->city,
            'country' => $companyModel->country,
            'phone' => $companyModel->phone,
            'email' => $companyModel->email,
            'web' => $companyModel->web,
            'bank' => $companyModel->bank_name, // DB: bank_name, FE: bank
            'bankaccount' => $companyModel->bank_account, // DB: bank_account, FE: bankaccount
        ];
        
        // Pass the single company object (not an array of one) to Inertia,
        // as the frontend likely only expects one company.
        return Inertia::render('Settings', [
            'storeUrl' => route('settings-store'),
            'company' => $company, // Pass the single company object
        ]);
    }

    // ... create() method remains empty or can be removed if unused

    /**
     * Store a newly created resource in storage.
     * Uses CompanyStoreUpdateRequest for automatic validation.
     */
    public function store(CompanyStoreUpdateRequest $request) // <-- Used the new Request
    {
        $this->companyRepository->updatePrimaryCompany($request->validated());
        return response()->json(
            [
                'message' => 'Company details stored',
                'type' => 'success',
            ],
            201
        );
    }
}