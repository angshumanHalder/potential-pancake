package services

import (
	"context"
	"time"

	"github.com/angshumanHalder/potential-pancake/pkg/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Event struct {
	Id        primitive.ObjectID `bson:"_id"`
	Name      string             `bson:"name"`
	Room      string             `bson:"room"`
	Attendees []string           `bson:"attendees"`
	StartTime int64              `bson:"start_time"`
	EndTime   int64              `bson:"end_time"`
}

type CalendarEvent struct {
	Name      string
	Room      string
	StartTime string
	EndTime   string
	Attendees []string
	Zone      string
}

func InsertEvent(db *mongo.Database, jsonE CalendarEvent) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	start, err := utils.StringToRFC3339(jsonE.StartTime)
	if err != nil {
		return err
	}
	end, err := utils.StringToRFC3339(jsonE.StartTime)
	if err != nil {
		return err
	}
	event := Event{
		Id:        primitive.NewObjectID(),
		Name:      jsonE.Name,
		Room:      jsonE.Room,
		Attendees: jsonE.Attendees,
		StartTime: start,
		EndTime:   end,
	}
	if _, err := db.Collection("events").InsertOne(ctx, event); err != nil {
		return err
	}
	return nil
}
