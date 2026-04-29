<template>
  <v-container style="min-height: 100vh; padding-top: 20px;">
    <v-row style="text-align: center;">
      <v-col>
        <h1 style="font-size: 50px;">FacilityList</h1>
        <NuxtLink to="/Admins/FacilityList">
          <v-btn depressed color="primary" class="px-10 py-10 mx-10 my-10"> <h1 style="font-size: 50px;">Go</h1> </v-btn>
        </NuxtLink>
        <NuxtLink to="/Admins/FacilityListAi">
          <v-btn depressed color="warning" class="px-10 py-10 mx-10 my-10"> <h1 style="font-size: 50px;">Go</h1> </v-btn>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>
