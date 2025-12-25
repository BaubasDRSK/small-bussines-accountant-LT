<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyStoreUpdateRequest; // <-- New Request
use App\Models\Company;
use App\Repositories\CompanyRepository; // <-- New Repository
use Inertia\Inertia;

class CompanyController extends Controller
{
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
        $companyModel = $this->companyRepository->getPrimaryCompany();
        $company = $companyModel->toArray();
        
        return Inertia::render('Settings', [
            'storeUrl' => route('settings-store'),
            'company' => $company, // Pass the single company object
        ]);
    }

    
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