package main

import (
	"context"
	"log"
	"sync"

	"github.com/angshumanHalder/potential-pancake/pkg/config"
	"github.com/angshumanHalder/potential-pancake/pkg/db"
	"github.com/angshumanHalder/potential-pancake/pkg/routes"
)

func main() {
	config.ReadConfigVars()
	datastore := db.CreateDataStore()
	defer datastore.Client.Disconnect(context.TODO())

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		log.Printf("starting JSON API server... \n")
		routes.Serve(datastore.Database, config.Config.Server.Port)
		wg.Done()
	}()
	wg.Wait()
}
