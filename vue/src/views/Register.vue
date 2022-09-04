<template>
  <div>
    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Register</h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Or
      {{ ' ' }}
      <router-link :to="{name: 'Login'}" class="font-medium text-indigo-600 hover:text-indigo-500">Login to your account</router-link>
    </p>
  </div>

  <form class="mt-8 space-y-6" @submit.prevent="register">
    <input type="hidden" name="remember" value="true" />

    <div class="-space-y-px rounded-md shadow-sm">
      <div>
        <label for="full-name" class="sr-only">Full name</label>
        <input id="full-name" v-model="user.name" type="text" autocomplete="name" required="" class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Full name" />
      </div>

      <div>
        <label for="email-address" class="sr-only">Email address</label>
        <input id="email-address" v-model="user.email" type="email" autocomplete="email" required="" class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Email address" />
      </div>

      <div>
        <label for="password" class="sr-only">Password</label>
        <input id="password" v-model="user.password" type="password" autocomplete="current-password" required="" class="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Password" />
      </div>

      <div>
        <label for="password_confirmation" class="sr-only">Password confirm</label>
        <input id="password_confirmation" v-model="user.password_confirmation" type="password" autocomplete="current-password" required="" class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Enter password again" />
      </div>
    </div>

    <div>
      <button type="submit" class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Sign up
      </button>
    </div>

  </form>
</template>

<script setup>

import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const user = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
};

const register = async (ev) => {
  const response = await store.dispatch('register', user);

  if(response) router.push({ name: 'Dashboard' });
}

</script>
