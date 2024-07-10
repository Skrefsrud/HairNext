"use client";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";

import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import Employees from "./Employees";
import Bookings from "./Bookings";
import Services from "./Services";
import Availabilities from "./Availabilites";
import OpeningHours from "./OpeningHours";
import { ClockIcon } from "@radix-ui/react-icons";
import { Dashboard } from "./Dashboard";

export function AdminNav() {
  return (
    <div>
      <div />
      <div>
        <Tabs>
          <TabsList className='flex gap-4'>
            <TabsTrigger value='dashboard'>
              <HomeIcon className='h-4 w-4' />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value='employees'>
              <UsersIcon className='h-4 w-4' />
              Employees
            </TabsTrigger>
            <TabsTrigger value='availabilities'>
              <BoxIcon className='h-4 w-4' />
              Availabilities
            </TabsTrigger>
            <TabsTrigger value='bookings'>
              <ShoppingBagIcon className='h-4 w-4' />
              Bookings
            </TabsTrigger>
            <TabsTrigger value='services'>
              <BoxIcon className='h-4 w-4' />
              Services
            </TabsTrigger>
            <TabsTrigger value='openingHours'>
              <ClockIcon className='h-4 w-4' />
              Opening Hours
            </TabsTrigger>
          </TabsList>
          <TabsContent value='dashboard'>
            <div className='flex flex-col gap-2 p-4'>
              <h1 className='text-2xl font-semibold'>Dashboard</h1>
              <Dashboard></Dashboard>
            </div>
          </TabsContent>
          <TabsContent value='employees'>
            <div className='p-4'>
              <h1 className='text-2xl font-semibold'>Employees</h1>
              <Employees></Employees>
            </div>
          </TabsContent>
          <TabsContent value='availabilities'>
            <div className='p-4'>
              <h1 className='text-2xl font-semibold'>Availabilities</h1>
              <Availabilities></Availabilities>
            </div>
          </TabsContent>
          <TabsContent value='bookings'>
            <div className='p-4'>
              <h1 className='text-2xl font-semibold'>Bookings</h1>
              <Bookings></Bookings>
            </div>
          </TabsContent>
          <TabsContent value='services'>
            <div className='p-4'>
              <h1 className='text-2xl font-semibold'>Services</h1>
              <Services></Services>
            </div>
          </TabsContent>
          <TabsContent value='openingHours'>
            <div className='p-4'>
              <h1 className='text-2xl font-semibold'>Opening Hours</h1>
              <OpeningHours></OpeningHours>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
      <polyline points='9 22 9 12 15 12 15 22' />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </svg>
  );
}

function ShoppingBagIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z' />
      <path d='M3 6h18' />
      <path d='M16 10a4 4 0 0 1-8 0' />
    </svg>
  );
}

function BoxIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' />
      <path d='m3.3 7 8.7 5 8.7-5' />
      <path d='M12 22V12' />
    </svg>
  );
}

function BarChart(props) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={[
          { name: "Jan", count: 111 },
          { name: "Feb", count: 157 },
          { name: "Mar", count: 129 },
          { name: "Apr", count: 150 },
          { name: "May", count: 119 },
          { name: "Jun", count: 72 },
        ]}
        keys={["count"]}
        indexBy='name'
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role='application'
        ariaLabel='A bar chart showing data'
      />
    </div>
  );
}

function CurvedlineChart(props) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
        }}
        curve='monotoneX'
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role='application'
      />
    </div>
  );
}
