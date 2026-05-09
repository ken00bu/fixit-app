'use client'
import { AppShell, Flex, Stack, NavLink, Button, Title } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { IconLayoutDashboard, IconPlus, IconLogout, IconUserCog, IconUser, IconTool, IconMapPin, IconSchool,IconCategory, IconClipboardList } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavBar from "./NavBar";
import { API_URL } from "@/config/config";
import { useRouter } from "next/navigation"
import { createContext, useContext, useState, ReactNode } from "react";


const AppContext = createContext<any>(undefined);

export default function NavBarShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [ refreshKey, setRefreshKey ] = useState(0)
  const pathname = usePathname();
  const router = useRouter()

  const menus = [
    {
        label: "Profile Saya",
        href: "/admin/profile",
        icon: IconUser,
    },
    {
        label: "Manage Report",
        href: "/admin",
        icon: IconClipboardList,
    },
    {
        label: "Teknisi",
        href: "/admin/daftar-teknisi",
        icon: IconUserCog,
    },
    {
        label: "Skill",
        href: "/admin/tambah-skill",
        icon: IconTool,
    },
    {
        label: "Lokasi",
        href: "/admin/tambah-lokasi",
        icon: IconMapPin,
    },
    {
        label: "Kategori",
        href: "/admin/tambah-kategori",
        icon: IconCategory,
    },
  ];

  const Logout = () => {
    const logout = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: 'include'
        })
        
        if (!res.ok) {
            const error = await res.json()
            console.error("Failed to logout:", error.message || "Unknown error")
            return
        }
        router.push("/login")
      } catch (error) {
          console.error("Error fetching report detail:", error)
      }
    };
    logout();
  }

  return (
    <AppContext.Provider value={{ refreshKey, reportRefresh: () => setRefreshKey((prev: number) => prev + 1) }}>
      <AppShell
        header={{ height: { base: 60, sm: 0 } }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header hiddenFrom="sm">
          <NavBar opened={opened} toggle={toggle}/>
        </AppShell.Header>

        <AppShell.Navbar >
          <Flex justify={'space-between'} mih={'100%'} direction={'column'}>
            <Stack p="md" gap="xs">
              <Title>Fixit</Title>
              {menus.map((menu) => {
                const Icon = menu.icon;
                const isActive = pathname === menu.href ? true : false;

                return (
                  <NavLink
                    bdrs={8}
                    key={menu.href}
                    label={menu.label}
                    component={Link}
                    href={menu.href}
                    leftSection={<Icon size={18} />}
                    active={isActive}
                    
                  />
                );
              })}
            </Stack>
            <Button h={80} c={'red'} variant="default" color="transparent" justify='flex-start' p={30} leftSection={<IconLogout size={18} />} onClick={()=>Logout()} radius={0} >
              Logout
            </Button>
          </Flex>
        </AppShell.Navbar>

        <AppShell.Main bg={"#F5F7FA"}>
          <Flex p={{base: '', sm: 10}} direction={"column"} maw={'100%'} gap={40}>
            {children}
          </Flex>
        </AppShell.Main>
      </AppShell>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}