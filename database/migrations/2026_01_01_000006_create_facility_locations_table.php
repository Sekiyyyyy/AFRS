<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facility_locations', function (Blueprint $table) {
            $table->id();
            $table->string('building', 100);
            $table->string('floor', 20);
            $table->string('room_name', 100);
            $table->string('description')->nullable();
            $table->timestamps();

            $table->unique(['building', 'floor', 'room_name'], 'uk_facility_locations');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_locations');
    }
};
