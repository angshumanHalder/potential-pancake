package config

import (
	"log"

	"github.com/spf13/viper"
)

type Configurations struct {
	Server   ServerConfig
	Database DatabaseConfg
	Token    TokenConfig
	Client   ClientConfig
}

type ServerConfig struct {
	Port string
}

type DatabaseConfg struct {
	DBName     string
	DBUser     string
	DBPassword string
	DBURI      string
}

type TokenConfig struct {
	Secret string
}

type ClientConfig struct {
	Id     string
	Secret string
}

var Config *Configurations

func ReadConfigVars() {
	viper.SetConfigName("config")
	viper.AddConfigPath("./pkg/config")
	viper.AutomaticEnv()

	viper.SetConfigType("yml")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("error reading config file: %s", err)
	}

	if err := viper.Unmarshal(&Config); err != nil {
		log.Fatalf("unable to unmarshal configuration from yml")
	}
}
