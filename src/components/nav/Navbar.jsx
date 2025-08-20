import React, { useState } from "react";
import { Avatar, Text, Indicator, Menu, Box } from "@mantine/core";
import { IoMdNotifications, IoIosLogOut } from "react-icons/io";
import { useDisclosure } from "@mantine/hooks";
import { IoSettingsOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [showNotification, { setShowNotification }] = useDisclosure();
  const { fname, lname, email } = useSelector((state) => state?.auth?.authUser);

  const profileMenu = () => {
    return (
      <Menu
        shadow="lg"
        width={200}
        withArrow
        arrowSize={10}
        arrowPosition="center"
        styles={{
          dropdown: {
            backgroundColor: "#c1c6ca", // dark background
            border: "1px solid #0e3557",
            padding: 12,
          },
          item: {
            color: "#0e3557",
            "&[data-hovered]": {
              backgroundColor: "#333",
            },
          },
          label: {
            color: "#0e3557",
            fontSize: "1rem",
          },
          divider: {
            borderColor: "#0e3557",
          },
        }}
      >
        <Menu.Target>
          <Avatar
            color="initials"
            size="md"
            key={`${fname} ${lname}`}
            name={`${fname} ${lname}`}
            className="ring-1 ring-white cursor-pointer"
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>
            <Box ta={"center"}>
              <Text fw={300} size="md">
                Hi, {fname}
              </Text>
              <Text fw={300} size="xs">
                {email}
              </Text>
            </Box>
          </Menu.Label>
          <Menu.Divider />
          <Menu.Item fw={300} size={16} leftSection={<CiEdit size={24} />}>
            Edit profile
          </Menu.Item>
          <Menu.Item
            fw={300}
            size={16}
            leftSection={<IoSettingsOutline size={22} />}
          >
            Settings
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item fw={300} size={16} leftSection={<IoIosLogOut size={22} />}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  return (
    <main className="bg-main">
      <section className="container mx-auto">
        <div className="min-h-[80px] flex justify-between items-center">
          <div className="flex flex-row justify-center items-center gap-24">
            <Text size={"xl"} fw={500} c={"#f5f2ec"}>
              LOGO
            </Text>
          </div>
          <div className="flex flex-row justify-between items-center gap-3">
            <div className="gap-0 cursor-pointer">
              <Indicator
                inline
                processing
                offset={8}
                color="#920000"
                size={10}
                disabled={!showNotification}
              >
                <IoMdNotifications size={28} color="#c1c6ca" />
              </Indicator>
            </div>
            {profileMenu()}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Navbar;
