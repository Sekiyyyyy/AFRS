<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('facility_categories')->restrictOnDelete();
            $table->foreignId('location_id')->constrained('facility_locations')->restrictOnDelete();
            $table->string('facility_code', 50)->unique();
            $table->string('name', 150);
            $table->string('brand_model', 100)->nullable();
            $table->string('serial_number', 100)->nullable();
            $table->enum('status', ['operational', 'damaged', 'maintenance', 'retired'])->default('operational');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
