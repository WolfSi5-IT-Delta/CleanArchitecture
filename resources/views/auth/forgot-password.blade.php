<x-guest-layout>
    <x-auth-card>

        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <x-slot name="logo">
                <x-application-logo class="w-20 h-20 fill-current text-gray-500" />
            </x-slot>
            <x-slot name="title">
                Forgot your password?
            </x-slot>
        </div>

        <!-- Session Status -->
        <x-auth-session-status class="mb-4" :status="session('status')" />

        <!-- Validation Errors -->
        <x-auth-validation-errors class="mb-4" :errors="$errors" />

        <form class="space-y-6" method="POST" action="{{ route('password.email') }}">
            @csrf

            <div class="block text-sm font-medium text-gray-700">
                {{__('Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.')}}
            </div>

            <!-- Email Address -->
            <div>
                <x-label for="email" :value="__('Email')" />

                <x-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus />
            </div>

            <div class="flex items-center justify-end mt-4">
                <x-button>
                    {{ __('Email Password Reset Link') }}
                </x-button>
            </div>
        </form>
    </x-auth-card>
</x-guest-layout>
