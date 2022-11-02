package services

import (
	"context"
	"log"
	"time"

	"github.com/angshumanHalder/potential-pancake/pkg/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Event struct {
	Id            primitive.ObjectID `bson:"_id"`
	Name          string             `bson:"name"`
	Room          string             `bson:"room"`
	Attendees     []string           `bson:"attendees"`
	StartDateTime int64              `bson:"start_time"`
	EndDateTime   int64              `bson:"end_time"`
}

type CalendarEvent struct {
	Name          string
	StartDateTime string
	EndDateTime   string
	Attendees     []string
	TimeZone      string
}

const collection = "events"

func InsertEvent(db *mongo.Database, jsonE CalendarEvent, room string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	start, err := utils.StringToRFC3339(jsonE.StartDateTime)
	if err != nil {
		return err
	}
	end, err := utils.StringToRFC3339(jsonE.EndDateTime)
	if err != nil {
		return err
	}
	event := Event{
		Id:            primitive.NewObjectID(),
		Name:          jsonE.Name,
		Room:          room,
		Attendees:     jsonE.Attendees,
		StartDateTime: start,
		EndDateTime:   end,
	}
	if _, err := db.Collection(collection).InsertOne(ctx, event); err != nil {
		return err
	}
	return nil
}

func GetAllUserEvents(db *mongo.Database, user string) ([]Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var events []Event

	cursor, err := db.Collection(collection).Find(ctx, bson.M{"attendees": user})
	if err != nil {
		log.Printf("Error %v", err)
		return nil, err
	}
	defer cursor.Close(ctx)
	if err = cursor.All(ctx, &events); err != nil {
		return nil, err
	}
	return events, nil
}

func CancelEvent(db *mongo.Database, user User, room string) error {
	log.Println("cancel event service", room)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if _, err := db.Collection(collection).DeleteOne(ctx, bson.M{"room": room, "attendees": user.Email}); err != nil {
		return err
	}
	return nil
}
