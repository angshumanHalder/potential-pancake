package routes

import (
	"log"
	"net/http"

	"github.com/angshumanHalder/potential-pancake/pkg/controllers"
	"github.com/angshumanHalder/potential-pancake/pkg/middlewares"
	"go.mongodb.org/mongo-driver/mongo"
)

func Serve(db *mongo.Database, port string) {
	// handlers
	http.Handle("/api/login", controllers.Login(db))
	http.Handle("/api/logout", middlewares.AuthMiddleware(db)(controllers.Logout(db)))
	http.Handle("/api/create-event", middlewares.AuthMiddleware(db)(controllers.CreateEvent(db)))
	http.Handle("/api/get-events", middlewares.AuthMiddleware(db)(controllers.GetALLUserEvents(db)))
	http.Handle("/api/cancel-event", middlewares.AuthMiddleware(db)(controllers.CancelEvent(db)))

	log.Printf("JSON API server listening on %v \n", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatalf("JSON server error: %v", err)
	}
}
