package config

import (
	"log"
	"os"

	"github.com/caarlos0/env/v10"
	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

// Config represents the configuration settings for the application, loaded from environment variables.
//
// Fields:
//   - Screenshots: The configuration settings for taking screenshots of websites.
type Config struct {
	Server   ServerConfig   `yaml:"server"`
	Firebase FirebaseConfig `yaml:"firebase"`
}

// FirebaseConfig represents the configuration settings for the firebase app.
//
// Fields:
//   - StorageBucket: The name of the storage bucket.
//   - ProjectID: The project ID.
//   - CredentialsBase64: The base64 encoded credentials for the firebase app.
type FirebaseConfig struct {
	StorageBucket     string `yaml:"storageBucket" env:"FIREBASE.STORAGE_BUCKET"`
	ProjectID         string `yaml:"projectId" env:"FIREBASE.PROJECT_ID"`
	CredentialsBase64 string `yaml:"credentialsBase64" env:"FIREBASE.CREDENTIALS_BASE64"`
}

// ServerConfig represents the configuration settings for the server.
//
// Fields:
//   - Port: The port the server listens on.
//   - Host: The host the server listens on.
//   - ClientAddress: The address of the client.
type ServerConfig struct {
	Port          string `yaml:"port" env:"SERVER.PORT"`
	Host          string `yaml:"host" env:"SERVER.HOST"`
	ClientAddress string `yaml:"clientAddress" env:"SERVER.CLIENT_ADDRESS"`
}

// generateConfig loads configuration settings from configuration variables.
//
// Returns:
//   - Config: The configuration settings for the application.
//
// Note: The function panics if there is an error loading the .yml file.
func MustGenerateConfig() Config {
	f, err := os.Open("config.yaml")
	if err != nil {
		log.Fatalf(err.Error())
	}
	defer f.Close()

	var cfg Config
	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(&cfg)
	if err != nil {
		log.Fatalf("Error generating yaml config: %s", err.Error())
	}

	err = godotenv.Load()
	if err != nil {
		log.Printf("Error loading env file but will continue: %s", err.Error())
	}

	err = env.Parse(&cfg)
	if err != nil {
		log.Fatalf("Error generating env config: %s", err.Error())
	}

	return cfg
}
