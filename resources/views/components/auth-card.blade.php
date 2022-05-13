<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div>
        {{ $logo }}
    </div>

    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ $title ?? ''}}
    </h2>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {{ $slot }}
        </div>
    </div>
</div>
