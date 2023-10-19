<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('company_id')->unique();
            $table->string('name')->default('');
            $table->string('code')->default('');
            $table->boolean('vat_status')->default(false);
            $table->string('vat_code')->default('-');
            $table->string('street')->default('');
            $table->string('city')->default('');
            $table->string('country')->default('Lietuva');
            $table->string('phone')->default('+370');
            $table->string('email')->default('');
            $table->string('web')->default('');
            $table->string('bank_name')->default('');
            $table->string('bank_account')->default('');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
