package services

import (
	"context"
	"time"

	"github.com/angshumanHalder/potential-pancake/pkg/utils"
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
	Room          string
	StartDateTime string
	EndDateTime   string
	Attendees     []string
	TimeZone      string
}

func InsertEvent(db *mongo.Database, jsonE CalendarEvent) error {
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
		Room:          jsonE.Room,
		Attendees:     jsonE.Attendees,
		StartDateTime: start,
		EndDateTime:   end,
	}
	if _, err := db.Collection("events").InsertOne(ctx, event); err != nil {
		return err
	}
	return nil
}
