<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 32)->unique();
            $table->foreignId('reporter_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('department_id')->constrained('departments')->restrictOnDelete();
            $table->foreignId('category_id')->constrained('facility_categories')->restrictOnDelete();
            $table->foreignId('location_id')->constrained('facility_locations')->restrictOnDelete();
            $table->foreignId('facility_id')->nullable()->constrained('facilities')->nullOnDelete();
            $table->string('title', 200);
            $table->text('description');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', [
                'submitted',
                'under_review',
                'assigned',
                'in_progress',
                'waiting_information',
                'on_hold',
                'resolved',
                'closed',
                'rejected'
            ])->default('submitted');
            $table->text('resolution_notes')->nullable();
            $table->string('rejection_reason', 255)->nullable();
            $table->timestamp('submitted_at');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index('reporter_id');
            $table->index('category_id');
            $table->index('location_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
