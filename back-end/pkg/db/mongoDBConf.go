package db

import (
	"context"
	"log"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"github.com/angshumanHalder/potential-pancake/pkg/config"
)

type MongoDataStore struct {
	*mongo.Database
	*mongo.Client
}

func CreateDataStore() *MongoDataStore {
	var dataStore *MongoDataStore
	db, client := connect()
	if db == nil || client == nil {
		log.Fatalf("failed to connect to database %v %v", db, client)
	}
	dataStore = &MongoDataStore{
		db,
		client,
	}
	return dataStore
}

func connect() (*mongo.Database, *mongo.Client) {
	var connectOnce sync.Once
	var db *mongo.Database
	var client *mongo.Client
	connectOnce.Do(func() {
		db, client = connectToMongo()
	})
	return db, client
}

func connectToMongo() (a *mongo.Database, b *mongo.Client) {
	var err error
	client, err := mongo.NewClient(options.Client().ApplyURI(config.Config.Database.DBURI))
	if err != nil {
		log.Fatal(err)
	}
	client.Connect(context.TODO())
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	if err = client.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Fatal(err)
	}
	database := client.Database(config.Config.Database.DBName)
	log.Printf("CONNECTED, %v", config.Config.Database.DBName)

	return database, client
}
