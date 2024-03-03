package config

import (
	"log"
	"os"
	"time"

	"gopkg.in/yaml.v3"
)

// Config represents the configuration settings for the application, loaded from environment variables.
//
// Fields:
//   - Screenshots: The configuration settings for taking screenshots of websites.
type Config struct {
	Screenshot ScreenshotConfig `yaml:"screenshot"`
	Server     ServerConfig     `yaml:"server"`
	Firebase   FirebaseConfig   `yaml:"firebase"`
}

// FirebaseConfig represents the configuration settings for the firebase app.
//
// Fields:
//   - StorageBucket: The name of the storage bucket.
//   - CredentialPath: The path to the credentials file.
//   - ProjectID: The project ID.
type FirebaseConfig struct {
	StorageBucket  string `yaml:"storageBucket"`
	CredentialPath string `yaml:"credentialPath"`
	ProjectID      string `yaml:"projectId"`
}

// ServerConfig represents the configuration settings for the server.
//
// Fields:
//   - Port: The port the server listens on.
//   - Host: The host the server listens on.
type ServerConfig struct {
	Port string `yaml:"port"`
	Host string `yaml:"host"`
}

// ScreenshotConfig represents the configuration settings for taking screenshots of websites.
//
// Fields:
//   - Width: The width of the screenshot.
//   - Height: The height of the screenshot.
//   - Delay: The delay before taking the screenshot.
//   - EndDelay: The delay after taking the screenshot.
//   - Retries: The number of retries to take the screenshot.
type ScreenshotConfig struct {
	Width       int64         `yaml:"width"`
	Height      int64         `yaml:"height"`
	Delay       time.Duration `yaml:"delayInSeconds"`
	EndDelay    time.Duration `yaml:"endDelayInSeconds"`
	Retries     int           `yaml:"retries"`
	HeadlessUrl string        `yaml:"headlessUrl"`
}

// generateConfig loads configuration settings from configuration variables.
//
// Returns:
//   - Config: The configuration settings for the application.
//
// Note: The function panics if there is an error loading the .yml file.
func GenerateConfig() Config {
	f, err := os.Open("config.yaml")
	if err != nil {
		log.Fatalf(err.Error())
	}
	defer f.Close()

	var cfg Config
	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(&cfg)
	if err != nil {
		log.Fatalf(err.Error())
	}

	return cfg
}
