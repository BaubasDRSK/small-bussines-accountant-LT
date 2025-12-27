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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('expense_number');
            $table->string('name');
            $table->unsignedBigInteger('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->json('customer')->nullable();
            $table->json('products')->nullable();
            $table->unsignedInteger('total')->defaul(0);
            $table->date('expense_date');
            $table->date('expense_due_date');
            $table->boolean('paid')->default(false);
            $table->text('notes')->nullable();
            //payments info
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
