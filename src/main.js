// Description: Main application file
// Author: Sebastián Gámez

// Import Vue
const { createApp } = Vue;

// Create the app
const app = createApp({
    data() {
        return {
            // Render
            render: {
                // Login
                login: true,
                // Users
                users: false,
            },
            // Username
            username: '',
            // Password
            password: '',
            // Name
            name: '',
            // Picture
            picture: '',
            // Users
            users: [],
            // Gender
            gender: 'all'
        }
    },
    // When the app is mounted
    async mounted() {
        if(localStorage.getItem('data')) {
            // Update users
            this.updateUsers();
        } else {
            // Get the users
            await this.getUsers();
        }
        // Print credentials
        this.printCredentials();
    },
    methods: {
        // Get users from API
        async getUsers() {
            // Define url
            let url = (this.gender === 'all')? 'https://randomuser.me/api/?results=5': `https://randomuser.me/api/?gender=${this.gender}&results=5`;
            // Get the users
            await fetch(url)
                // Get the response
                .then(response => response.json())
                // Get the data
                .then(data => {
                    // Set the users
                    this.users = data.results;
                    // Set flags
                    this.users.map(user => {
                        // Get the flag
                        user.flag = this.getFlag(user.location.country);
                    });
                }
            ).catch(error => {
                // Log the error
                console.log(error);
            });
            // Update localStorage
            this.updateLocalStorage();
        },
        // Get flag
        async getFlag(country) {
            // Get the flag
            await fetch(`https://restcountries.com/v3.1/name/${country}`)
                // Get the response
                .then(response => response.json())
                // Get the data
                .then(data => {
                    // Set the flag
                    return data[0].flags.png;
                }
            ).catch(error => {
                // Log the error
                console.log(error);
            });

        },
        // Update localStorage
        updateLocalStorage() {
            localStorage.setItem('data', JSON.stringify(this.users));
        },
        updateUsers() {
            // Get the users
            this.users = JSON.parse(localStorage.getItem('data'));
        },
        // Delete user
        deleteUser(user) {
            // Get the index
            const index = this.users.indexOf(user);
            // Delete the user
            this.users.splice(index, 1);
            // Update localStorage
            this.updateLocalStorage();
        },
        // Login
        login() {
            // Update users
            this.updateUsers();
            // Check if the user exists
            let exists = false;
            this.users.map(user => {
                // If the user exists
                if(user.login.username === this.username && user.login.password === this.password) {
                    // Set the user
                    exists = true;
                    // Set the picture
                    this.picture = user.picture.thumbnail;
                    // Set the name
                    this.name = `${user.name.first} ${user.name.last}`;
                    // Show message
                    swal("Bienvenido!", `Has iniciado sesión ${user.name.first}`, "success");
                    // Delete user from data
                    const index = this.users.indexOf(user);
                    // Delete the user
                    this.users.splice(index, 1);
                    // Hide login
                    this.render = {
                        login: false,
                        users: true
                    }
                }
                // If the user doesn't exist
            });

            if(!exists) {
                // Show message
                swal("Error!", "El usuario o contraseña no son correctos", "error");
            }
        },
        logout() {
            // Show login
            this.render = {
                login: true,
                users: false
            }
        },
        printCredentials() {
            this.users.map(user => {
                console.log(`Username: ${user.login.username} Password: ${user.login.password}`);
            });
        }

    }
});

// Mount the app
app.mount('#app');
